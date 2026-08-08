"use client";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { FormField } from "@/components/shared/form-field";
import { TranslatableFormField } from "@/components/shared/translatable-form-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";

const RichTextInput = dynamic(
  () =>
    import("@/components/shared/rich-text-editor/rich-text-input").then(
      (mod) => mod.RichTextInput,
    ),
  { loading: () => <DynamicLoader />, ssr: false },
);

export function MainFields() {
  const form = useFormContext<UpdateProfileInputSchema>();
  return (
    <FieldGroup>
      <FieldGroup className="flex-row">
        <TranslatableFormField
          control={form.control}
          name={"displayName"}
          label="Display Name"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <FormField
          control={form.control}
          name={"handle"}
          label="Handle"
          render={({ field }) => <Input {...(field as any)} />}
        />
      </FieldGroup>
      <FieldGroup className="flex-col lg:flex-row">
        <FormField
          control={form.control}
          name={"projectsShipped"}
          label="Projects Shipped"
          render={({ field }) => <Input {...(field as any)} type="number" />}
        />
        <FormField
          control={form.control}
          name={"openSourceContributions"}
          label="Open Source Contributions"
          render={({ field }) => <Input {...(field as any)} type="number" />}
        />
        <FormField
          control={form.control}
          name={"yearsOfExperience"}
          label="Years of experience"
          render={({ field }) => <Input {...(field as any)} type="number" />}
        />
      </FieldGroup>
      <FieldGroup>
        <TranslatableFormField
          control={form.control}
          name={"intro"}
          label="Intro"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"subHeading"}
          label="SubHeading"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"subtitle"}
          label="Subtitle"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"jobTitle"}
          label="Job title"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"location"}
          label="Location"
          render={({ field }) => <Input {...(field as any)} />}
        />
        <TranslatableFormField
          control={form.control}
          name={"currentFocus"}
          label={"Current focus"}
          render={({ field }) => <RichTextInput {...field} />}
        />
      </FieldGroup>
      <TranslatableFormField
        control={form.control}
        name={"summary"}
        label={"Summary"}
        render={({ field }) => <RichTextInput {...field} />}
      />
    </FieldGroup>
  );
}
