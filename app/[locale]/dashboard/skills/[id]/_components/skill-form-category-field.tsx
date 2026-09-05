"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CreateSkillFormInput, SkillCategory } from "@/lib/dto/skill";

export function SkillFormCategoryField() {
  const form = useFormContext<CreateSkillFormInput>();

  return (
    <div className="w-4.5">
      <FormField
        control={form.control}
        name="category"
        label="Category"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            disabled={form.formState.isSubmitting}
          >
            <SelectTrigger
              className="w-full md:w-45"
              disabled={form.formState.isSubmitting}
            >
              <SelectValue placeholder={"Skill Category"} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SkillCategory).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
