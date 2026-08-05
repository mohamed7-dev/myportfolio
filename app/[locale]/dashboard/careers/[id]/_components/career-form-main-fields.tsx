"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { SlugInput } from "@/components/data-input/slug-input";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  CreateCareerInputSchema,
  UpdateCareerInputSchema,
} from "@/lib/dto/career";

const RichTextInput = dynamic(
  () =>
    import("@/components/shared/rich-text-editor/rich-text-input").then(
      (mod) => mod.RichTextInput,
    ),
  { loading: () => <DynamicLoader />, ssr: false },
);

export function CareerFormMainFields() {
  const form = useFormContext<
    CreateCareerInputSchema | UpdateCareerInputSchema
  >();
  return (
    <FieldGroup>
      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"name"}
          label={"Career Name"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"slug"}
          label={"Career Slug"}
          disabled={true}
          render={({ field }) => (
            <SlugInput
              {...field}
              entityName="Career"
              fieldName="slug"
              watchFieldName="name"
              entityId={form.getValues("id")}
            />
          )}
        />
      </FieldGroup>

      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"location"}
          label={"Location"}
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"organization"}
          label={"Organization"}
          render={({ field }) => <Input {...(field as any)} />}
        />
      </FieldGroup>
      <FieldGroup>
        <TranslatableFormField
          control={form.control}
          name={"learned"}
          label={"What have you learned?"}
          render={({ field }) => <RichTextInput {...field} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"impact"}
          label={"What was your impact?"}
          render={({ field }) => <RichTextInput {...field} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"responsibilities"}
          label={"What was your responsibilities?"}
          render={({ field }) => <RichTextInput {...field} />}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
