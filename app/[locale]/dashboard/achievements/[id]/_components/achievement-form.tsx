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
import { Form } from "@/lib/helpers/form";

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
      const res = await fetch("/api/achievements", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as CreateAchievementOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Achievement was created successfully");
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast.success("Something went wrong while creating the achievement");
    },
  });

  const { mutate: updateAchievement } = useMutation({
    mutationKey: ["update-achievement"],
    mutationFn: async (input: UpdateAchievementInputSchema) => {
      const res = await fetch("/api/achievements", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as UpdateAchievementOutputSchema;
      return data;
    },
    onSuccess: () => {
      toast.success("Achievement was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the achievement");
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
