"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";

export function CvAssetIdField() {
  const form = useFormContext<UpdateProfileInputSchema>();
  return (
    <FormField
      control={form.control}
      name="cvAssetId"
      label="CV asset id"
      render={({ field }) => <Input {...field} />}
    />
  );
}
