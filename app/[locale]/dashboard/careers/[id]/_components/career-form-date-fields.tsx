"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateCareerInputSchema } from "@/lib/dto/career";

export default function CareerFormDateFields() {
  const form = useFormContext<CreateCareerInputSchema>();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name={"startDate"}
        label={"Start Date"}
        render={({ field }) => <Input {...(field as any)} type="date" />}
      />
      <FormField
        control={form.control}
        name={"endDate"}
        label={"End Date"}
        render={({ field }) => <Input {...(field as any)} type="date" />}
      />
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
            />
          </div>
        )}
      />
    </FieldGroup>
  );
}
