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
  AchievementType,
  type CreateAchievementInputSchema,
} from "@/lib/dto/achievement";

export function AchievementFormTypeField() {
  const form = useFormContext<CreateAchievementInputSchema>();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="type"
        label="Achievement Type"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Achievement Type"} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AchievementType).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldGroup>
  );
}
