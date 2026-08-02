"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateAchievementInputSchema } from "@/lib/dto/achievement";

export function AchievementFormMainFields() {
  const form = useFormContext<CreateAchievementInputSchema>();
  return (
    <FieldGroup>
      <FieldGroup className="md:flex-row">
        <TranslatableFormField
          control={form.control}
          name={"name"}
          label={"Achievement Name"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"slug"}
          label={"Achievement Slug"}
          render={({ field }) => <Input {...(field as any)} />}
        />
      </FieldGroup>
      <TranslatableFormField
        control={form.control}
        name={"organization"}
        label={"organization"}
        render={({ field }) => <Input {...(field as any)} />}
      />
      <FormField
        control={form.control}
        name={"credentialUrl"}
        label={"Credential URL"}
        render={({ field }) => <Input {...(field as any)} />}
      />
    </FieldGroup>
  );
}
