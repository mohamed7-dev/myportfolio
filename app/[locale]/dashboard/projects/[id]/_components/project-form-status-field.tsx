"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import type { CreateProjectInputSchema } from "@/lib/dto/project";

export function ProjectFormStatusField() {
  const form = useFormContext<CreateProjectInputSchema>();

  return (
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
  );
}
