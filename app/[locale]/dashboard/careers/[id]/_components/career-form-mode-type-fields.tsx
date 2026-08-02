"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CareerMode,
  CareerType,
  type CreateCareerInputSchema,
} from "@/lib/dto/career";

export function CareerFormModeTypeFields() {
  const form = useFormContext<CreateCareerInputSchema>();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="mode"
        label="Career Mode"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Career Mode"} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CareerMode).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        label="Career Type"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Career Type"} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CareerType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldGroup>
  );
}
