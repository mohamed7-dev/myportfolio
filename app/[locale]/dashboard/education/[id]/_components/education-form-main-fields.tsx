"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateEducationInputSchema } from "@/lib/dto/education";

export function EducationFormMainFields() {
  const form = useFormContext<CreateEducationInputSchema>();
  return (
    <FieldGroup>
      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"school"}
          label={"School"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"slug"}
          label={"Slug"}
          render={({ field }) => <Input {...(field as any)} />}
        />
      </FieldGroup>
      <FieldGroup className="lg:flex-row">
        <TranslatableFormField
          control={form.control}
          name={"degree"}
          label={"Degree"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"location"}
          label={"Location"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <FormField
          control={form.control}
          name={"gpa"}
          label={"GPA"}
          render={({ field }) => (
            <Input {...(field as any)} type="number" inputMode="numeric" />
          )}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
