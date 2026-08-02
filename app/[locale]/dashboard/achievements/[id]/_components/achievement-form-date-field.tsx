"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateAchievementInputSchema } from "@/lib/dto/achievement";

export default function AchievementFormDateField() {
  const form = useFormContext<CreateAchievementInputSchema>();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name={"issueDate"}
        label={"Issue Date"}
        render={({ field }) => <Input {...(field as any)} type="date" />}
      />
    </FieldGroup>
  );
}
