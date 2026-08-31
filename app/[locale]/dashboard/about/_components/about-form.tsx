"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ClientSafeProfile,
  type UpdateProfileInputSchema,
  type UpdateProfileOutputSchema,
  updateProfileInputSchema,
} from "@/lib/dto/profile";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function AboutForm({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: ClientSafeProfile;
}) {
  const form = useForm<UpdateProfileInputSchema>({
    defaultValues: {
      id: initialValues.id,
      handle: initialValues.handle ?? "",
      cvAssetId: initialValues.cvAssetId ?? "",
      projectsShipped: initialValues.projectsShipped ?? 0,
      openSourceContributions: initialValues.openSourceContributions ?? 0,
      yearsOfExperience: initialValues.yearsOfExperience ?? 0,
      assetIds:
        initialValues?.assets?.map((asset) => ({
          id: asset.asset.id,
          type: asset.type,
        })) ?? [],
      featuredAssetId: initialValues?.featuredAsset?.id ?? "",
      translations: initialValues?.translations ?? [],
    },
    resolver: zodResolver(updateProfileInputSchema),
  });

  const { mutate: updateProfile } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (input: UpdateProfileInputSchema) => {
      const res = await api(apiRoutes.profile.update, input, true);
      const data = (await res.json()) as UpdateProfileOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Profile was updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: UpdateProfileInputSchema) => {
    updateProfile(values);
  };

  return (
    <Form {...form}>
      <form id="update-profile-form" onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}
