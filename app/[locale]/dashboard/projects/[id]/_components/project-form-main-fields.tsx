"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { FormField } from "@/components/shared/form-field";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateProjectInputSchema } from "@/lib/dto/project";
import { normalizeString } from "@/lib/utils/normalize-string";

const RichTextInput = dynamic(
  () =>
    import("@/components/shared/rich-text-editor/rich-text-input").then(
      (mod) => mod.RichTextInput,
    ),
  { loading: () => <DynamicLoader />, ssr: false },
);

export function ProjectFormMainFields() {
  const form = useFormContext<CreateProjectInputSchema>();
  return (
    <FieldGroup>
      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"name"}
          label={"Project Name"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"slug"}
          label={"Project Slug"}
          disabled={true}
          render={({ field }) => (
            <Input
              {...(field as any)}
              value={normalizeString(
                form?.getValues?.("translations.0.name"),
                "-",
              )}
            />
          )}
        />
      </FieldGroup>
      <TranslatableFormField
        control={form.control}
        name={"description"}
        label={"Project Description"}
        render={({ field }) => <Input {...(field as any)} />}
      />

      <FormField
        control={form.control}
        name={"liveDemoUrl"}
        label={"Live Demo URL"}
        render={({ field }) => <Input {...field} type="url" inputMode="url" />}
      />

      <FormField
        control={form.control}
        name={"repoUrl"}
        label={"Repo URL"}
        render={({ field }) => <Input {...field} type="url" inputMode="url" />}
      />

      <TranslatableFormField
        control={form.control}
        name={"overview"}
        label={"Overview"}
        render={({ field }) => <RichTextInput {...field} />}
      />

      <TranslatableFormField
        control={form.control}
        name={"features"}
        label={"Features"}
        render={({ field }) => <RichTextInput {...field} />}
      />

      <TranslatableFormField
        control={form.control}
        name={"techStack"}
        label={"Tech Stack"}
        render={({ field }) => <RichTextInput {...field} />}
      />

      <TranslatableFormField
        control={form.control}
        name={"contributions"}
        label={"Contributions"}
        render={({ field }) => <RichTextInput {...field} />}
      />

      <TranslatableFormField
        control={form.control}
        name={"challengesAndSolutions"}
        label={"Challenges And Solutions"}
        render={({ field }) => <RichTextInput {...field} />}
      />

      <TranslatableFormField
        control={form.control}
        name={"technicalHighlights"}
        label={"Technical Highlights"}
        render={({ field }) => <RichTextInput {...field} />}
      />
    </FieldGroup>
  );
}
