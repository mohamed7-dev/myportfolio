"use client";
import { useFormContext } from "react-hook-form";
import { formatDateInput } from "@/lib/utils/format-date-input";
import { FormField, type FormFieldProps } from "../shared/form-field";
import { Input } from "../ui/input";

export function DateFormField(
  props: Omit<FormFieldProps, "render" | "control">,
) {
  const form = useFormContext();
  return (
    <FormField
      {...props}
      control={form.control}
      render={({ field }) => (
        <Input
          {...(field as any)}
          value={
            field.value instanceof Date
              ? formatDateInput(field.value)
              : (field.value ?? "")
          }
          onChange={(e) => {
            if (e.target.value === "") {
              field.onChange({ ...e, target: { ...e.target, value: null } });
            } else {
              field.onChange(e);
            }
          }}
          type="date"
          disabled={form.formState.isSubmitting}
        />
      )}
    />
  );
}
