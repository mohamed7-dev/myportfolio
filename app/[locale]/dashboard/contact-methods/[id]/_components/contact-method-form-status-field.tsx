"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import type {
  CreateContactMethodInputSchema,
  UpdateContactMethodInputSchema,
} from "@/lib/dto/contact-method";

export function ContactMethodFormStatusField() {
  const form = useFormContext<
    CreateContactMethodInputSchema | UpdateContactMethodInputSchema
  >();

  return (
    <FieldGroup>
      <div className="w-4.5">
        <FormField
          control={form.control}
          name="enabled"
          label="Enabled?"
          render={({ field }) => (
            <Checkbox
              {...(field as any)}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
      <div className="w-4.5">
        <FormField
          control={form.control}
          name="primary"
          label="Primary?"
          render={({ field }) => (
            <Checkbox
              {...(field as any)}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </FieldGroup>
  );
}
