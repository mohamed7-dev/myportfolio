"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NEW_ENTITY_PATH } from "@/lib/constants";
import {
  type Achievement,
  type CreateAchievementInputSchema,
  type CreateAchievementOutputSchema,
  createAchievementInputSchema,
  type UpdateAchievementInputSchema,
  type UpdateAchievementOutputSchema,
  updateAchievementInputSchema,
} from "@/lib/dto/achievement";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { formSubmittedEvent } from "@/lib/helpers/events";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function AchievementForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Achievement;
}) {
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;
  const router = useRouter();

  const form = useForm<CreateAchievementInputSchema>({
    defaultValues: {
      credentialUrl: "",
      issueDate: undefined,
      type: undefined,
      assetIds: [],
      featuredAssetId: undefined,
      translations: [],
    },
    resolver: zodResolver(createAchievementInputSchema),
  });

  const updateForm = useForm<UpdateAchievementInputSchema>({
    defaultValues: {
      id: initialValues?.id ?? "",
      credentialUrl: initialValues?.credentialUrl ?? "",
      type: initialValues?.type ?? undefined,
      issueDate: initialValues?.issueDate ?? undefined,
      translations: initialValues?.translations ?? [],
      assetIds: initialValues?.assets.map((asset) => asset.id) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? undefined,
    },
    resolver: zodResolver(updateAchievementInputSchema),
  });

  const { mutate: createAchievement } = useMutation({
    mutationKey: ["create-achievement"],
    mutationFn: async (input: CreateAchievementInputSchema) => {
      const res = await api(apiRoutes.achievements.create, input, true);
      const data = (await res.json()) as CreateAchievementOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Achievement was created successfully");
      form.reset();
      formSubmittedEvent().emit("create");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateAchievement } = useMutation({
    mutationKey: ["update-achievement"],
    mutationFn: async (input: UpdateAchievementInputSchema) => {
      const res = await api(apiRoutes.achievements.update, input, true);
      const data = (await res.json()) as UpdateAchievementOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("Achievement was updated successfully");
      formSubmittedEvent().emit("update", data.assets, data.featuredAsset);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (
    values: CreateAchievementInputSchema | UpdateAchievementInputSchema,
  ) => {
    if (creatingNewEntity) {
      createAchievement({
        ...values,
      } as CreateAchievementInputSchema);
    } else {
      updateAchievement({
        ...values,
        id: params.id,
      } as UpdateAchievementInputSchema);
    }
  };

  return (
    <Form {...((creatingNewEntity ? form : updateForm) as any)}>
      <form
        id="achievement-form"
        onSubmit={(creatingNewEntity ? form : updateForm).handleSubmit(
          onSubmit,
        )}
      >
        {children}
      </form>
    </Form>
  );
}
