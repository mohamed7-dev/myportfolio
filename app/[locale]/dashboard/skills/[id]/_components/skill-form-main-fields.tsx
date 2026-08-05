"use client";
import { useFormContext } from "react-hook-form";
import { SlugInput } from "@/components/data-input/slug-input";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  CreateSkillInputSchema,
  UpdateSkillInputSchema,
} from "@/lib/dto/skill";

export function SkillFormMainFields() {
  const form = useFormContext<
    CreateSkillInputSchema | UpdateSkillInputSchema
  >();
  return (
    <FieldGroup>
      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"name"}
          label={"Skill Name"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"slug"}
          label={"Skill Slug"}
          disabled={true}
          render={({ field }) => (
            <SlugInput
              {...field}
              entityName="Skill"
              fieldName="slug"
              watchFieldName="name"
              entityId={form.getValues("id")}
            />
          )}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
