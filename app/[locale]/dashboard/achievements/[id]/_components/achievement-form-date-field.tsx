"use client";
import { DateFormField } from "@/components/data-input/date-form-field";
import { FieldGroup } from "@/components/ui/field";

export function AchievementFormDateField() {
  return (
    <FieldGroup>
      <DateFormField name={"issueDate"} label={"Issue Date"} />
    </FieldGroup>
  );
}
