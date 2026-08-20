"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Asset,
  type UpdateAssetInputSchema,
  type UpdateAssetOutputSchema,
  updateAssetInputSchema,
} from "@/lib/dto/asset";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { Form } from "@/lib/helpers/form";
import { apiRoutes } from "@/lib/helpers/router";

export function UpdateAssetForm({
  children,
  asset,
}: {
  children: React.ReactNode;
  asset: Asset;
}) {
  const form = useForm<UpdateAssetInputSchema>({
    defaultValues: {
      id: asset.id,
      tags: asset.tags?.map((t) => t.value) ?? [],
      translations: asset.translations,
    },
    resolver: zodResolver(updateAssetInputSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["update-asset"],
    mutationFn: async (input: UpdateAssetInputSchema) => {
      const res = await api(apiRoutes.assets.update, input, true);
      const data = (await res.json()) as UpdateAssetOutputSchema;
      if (isAppError(data)) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Asset was updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: UpdateAssetInputSchema) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form id="update-asset-form" onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}
