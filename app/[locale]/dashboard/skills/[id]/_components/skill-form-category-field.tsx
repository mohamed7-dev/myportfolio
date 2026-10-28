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
import { useScopedI18n } from "@/i18n/client";
import { type CreateSkillFormInput, SkillCategory } from "@/lib/dto/skill";

export function SkillFormCategoryField() {
  const form = useFormContext<CreateSkillFormInput>();
  const i18n = useScopedI18n("about");

  const getCategoryLabel = (category: SkillCategory) => {
    switch (category) {
      case SkillCategory.FRONTEND:
        return i18n("skills.categories.frontend");
      case SkillCategory.BACKEND:
        return i18n("skills.categories.backend");
      case SkillCategory.TOOLS:
        return i18n("skills.categories.tools");
      case SkillCategory.PROGRAMMING_LANGUAGES:
        return i18n("skills.categories.programmingLanguages");
      case SkillCategory.DEV_OPS:
        return i18n("skills.categories.devOps");
      case SkillCategory.Testing_QA:
        return i18n("skills.categories.testingQa");
      case SkillCategory.DATABASES:
        return i18n("skills.categories.databases");
      case SkillCategory.CLOUD_HOSTING:
        return i18n("skills.categories.cloudHosting");
      case SkillCategory.DESIGN_PROTOTYPING:
        return i18n("skills.categories.designPrototyping");
      case SkillCategory.MOBILE_DEVELOPMENT:
        return i18n("skills.categories.mobileDevelopment");
      case SkillCategory.SECURITY:
        return i18n("skills.categories.security");
    }
  };

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
                  {getCategoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
