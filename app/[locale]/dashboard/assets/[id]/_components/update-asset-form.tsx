"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Asset,
  type UpdateAssetInputSchema,
  updateAssetInputSchema,
} from "@/lib/dto/asset";
import { Form } from "@/lib/helpers/form";

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
      tags: asset.tags,
      translations: asset.translations,
    },
    resolver: zodResolver(updateAssetInputSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["update-asset"],
    mutationFn: async (input: UpdateAssetInputSchema) => {
      const res = await fetch("/api/assets", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as Asset;
      return data;
    },
    onSuccess: () => {
      toast.success("Asset was updated successfully");
    },
    onError: () => {
      toast.success("Something went wrong while updating the asset");
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
