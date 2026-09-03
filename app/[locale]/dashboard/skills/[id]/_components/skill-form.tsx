"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type CreateSkillInputSchema,
  type CreateSkillOutputSchema,
  createSkillInputSchema,
  type Skill,
  type UpdateSkillInputSchema,
  type UpdateSkillOutputSchema,
  updateSkillInputSchema,
} from "@/lib/dto/skill";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { formSubmittedEvent } from "@/lib/helpers/events";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function SkillForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Skill;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateSkillInputSchema>({
    defaultValues: {
      isFeatured: false,
      category: undefined,
      assetIds: [],
      translations: [],
    },
    resolver: zodResolver(createSkillInputSchema),
  });

  const updateForm = useForm<UpdateSkillInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      isFeatured: initialValues?.isFeatured ?? false,
      assetIds: initialValues?.assets?.map((asset) => asset.asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
      category: initialValues?.category ?? undefined,
      translations: initialValues?.translations ?? [],
    },
    resolver: zodResolver(updateSkillInputSchema),
  });

  const { mutate: createSkill } = useMutation({
    mutationKey: ["create-skill"],
    mutationFn: async (input: CreateSkillInputSchema) => {
      const res = await api(apiRoutes.skills.create, input, true);
      const data = (await res.json()) as CreateSkillOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Skill was created successfully");
      form.reset();
      formSubmittedEvent().emit("create");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateSkill } = useMutation({
    mutationKey: ["update-skill"],
    mutationFn: async (input: UpdateSkillInputSchema) => {
      const res = await api(apiRoutes.skills.update, input, true);
      const data = (await res.json()) as UpdateSkillOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("Skill was updated successfully");
      formSubmittedEvent().emit("update", data.assets, data.featuredAsset);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (
    values: CreateSkillInputSchema | UpdateSkillInputSchema,
  ) => {
    console.log({ values });
    if (creatingNewEntity) {
      createSkill({
        ...values,
      } as CreateSkillInputSchema);
    } else {
      updateSkill({
        ...values,
        id: params.id as string,
      } as UpdateSkillInputSchema);
    }
  };

  console.log(form.formState.errors);

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="skill-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
