"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ClientSafeProfile,
  type UpdateProfileInputSchema,
  updateProfileInputSchema,
} from "@/lib/dto/profile";
import { Form } from "@/lib/helpers/form";

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
      assetIds: initialValues?.assets?.map((asset) => asset.asset.id) ?? [],
      translations: initialValues?.translations ?? [],
    },
    resolver: zodResolver(updateProfileInputSchema),
  });

  const { mutate: updateProfile } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (input: UpdateProfileInputSchema) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as ClientSafeProfile;
      return data;
    },
    onSuccess: () => {
      toast.success("Profile was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the profile");
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
