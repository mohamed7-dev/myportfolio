"use client";

import { useFormContext } from "react-hook-form";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { Input } from "@/components/ui/input";
import type { UpdateAssetInputSchema } from "@/lib/dto/asset";

export function NameField() {
  const form = useFormContext<UpdateAssetInputSchema>();

  return (
    <TranslatableFormField
      control={form.control}
      name={"name"}
      label="Asset Name"
      render={({ field }) => <Input {...(field as any)} />}
    />
  );
}
