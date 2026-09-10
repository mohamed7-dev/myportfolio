"use client";
import { useFormContext } from "react-hook-form";
import { DateFormField } from "@/components/data-input/date-form-field";
import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import type { CreateEducationInputSchema } from "@/lib/dto/education";

export default function EducationFormDateFields() {
  const form = useFormContext<CreateEducationInputSchema>();

  return (
    <FieldGroup>
      <DateFormField name={"startDate"} label={"Start Date"} />
      <DateFormField name={"endDate"} label={"End Date"} />

      <FormField
        control={form.control}
        name="isPresent"
        label="Is Present?"
        render={({ field }) => (
          <div className="size-4.5">
            <Checkbox
              {...(field as any)}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={form.formState.isSubmitting}
            />
          </div>
        )}
      />
    </FieldGroup>
  );
}
