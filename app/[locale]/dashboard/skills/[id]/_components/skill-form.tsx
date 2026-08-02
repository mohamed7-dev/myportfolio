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
import { Form } from "@/lib/helpers/form";
import { normalizeString } from "@/lib/utils/normalize-string";

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
      assetIds: [],
      translations: [],
    },
    resolver: zodResolver(createSkillInputSchema),
  });

  const updateForm = useForm<UpdateSkillInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
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
      const res = await fetch("/api/skills", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as CreateSkillOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Skill was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while creating the skill");
    },
  });

  const { mutate: updateSkill } = useMutation({
    mutationKey: ["update-skill"],
    mutationFn: async (input: UpdateSkillInputSchema) => {
      const res = await fetch("/api/skills", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as UpdateSkillOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Skill was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the skill");
    },
  });

  const onSubmit = (
    values: CreateSkillInputSchema | UpdateSkillInputSchema,
  ) => {
    if (creatingNewEntity) {
      createSkill({
        ...values,
        category: (values as CreateSkillInputSchema).category,
        translations: values.translations.map((t) => ({
          ...t,
          slug: normalizeString(form.getValues("translations.0.name"), "-"),
        })) as any,
      });
    } else {
      updateSkill({
        ...values,
        id: params.id as string,
        translations: values.translations.map((t) => ({
          ...t,
          slug: normalizeString(form.getValues("translations.0.name"), "-"),
        })) as any,
      });
    }
  };

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
