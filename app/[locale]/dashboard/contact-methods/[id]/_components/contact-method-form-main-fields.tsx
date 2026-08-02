"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateContactMethodInputSchema } from "@/lib/dto/contact-method";

export function ContactMethodFormMainFields() {
  const form = useFormContext<CreateContactMethodInputSchema>();
  return (
    <FieldGroup>
      <TranslatableFormField
        control={form.control}
        name={"name"}
        label={"Contact Method Name"}
        render={({ field }) => <Input {...(field as any)} />}
      />
      <FormField
        control={form.control}
        name={"url"}
        label={"URL"}
        render={({ field }) => <Input {...(field as any)} />}
      />
      <FormField
        control={form.control}
        name={"copyableText"}
        label={"Copyable Text"}
        render={({ field }) => <Input {...(field as any)} />}
      />
    </FieldGroup>
  );
}
