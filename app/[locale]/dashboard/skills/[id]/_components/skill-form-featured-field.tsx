"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  CreateSkillInputSchema,
  UpdateSkillInputSchema,
} from "@/lib/dto/skill";

export function SkillFormFeaturedField() {
  const form = useFormContext<
    CreateSkillInputSchema | UpdateSkillInputSchema
  >();

  return (
    <div className="w-4.5">
      <FormField
        control={form.control}
        name="isFeatured"
        label="Featured?"
        render={({ field }) => (
          <Checkbox
            {...(field as any)}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
