"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useForm } from "react-hook-form";
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
      assetIds: initialValues?.assets?.map((asset) => asset.id) ?? [],
      translations: initialValues?.translations ?? [],
    },
    resolver: zodResolver(updateProfileInputSchema),
  });

  const onSubmit = (values: UpdateProfileInputSchema) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form id="update-profile-form" onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}
