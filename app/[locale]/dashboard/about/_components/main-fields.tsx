"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";

const RichTextInput = dynamic(
  () =>
    import("@/components/shared/rich-text-editor/rich-text-input").then(
      (mod) => mod.RichTextInput,
    ),
  { loading: () => <DynamicLoader />, ssr: false },
);

export function MainFields() {
  const form = useFormContext<UpdateProfileInputSchema>();
  return (
    <FieldGroup>
      <TranslatableFormField
        control={form.control}
        name={"displayName"}
        label="Display Name"
        render={({ field }) => <Input {...(field as any)} />}
      />
      <TranslatableFormField
        control={form.control}
        name={"summary"}
        label={"Summary"}
        render={({ field }) => <RichTextInput {...field} />}
      />
    </FieldGroup>
  );
}
