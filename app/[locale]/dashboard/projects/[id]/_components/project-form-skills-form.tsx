"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RelationField } from "@/components/data-input/relation-field";
import { Field } from "@/components/ui/field";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";
import type { CreateProjectInputSchema } from "@/lib/dto/project";
import type { Skill } from "@/lib/dto/skill";

export function ProjectFormSkillsField({ skills }: { skills: Skill[] }) {
  const form = useFormContext<
    CreateProjectInputSchema | UpdateProfileInputSchema
  >();
  const [open, setOpen] = React.useState(false);

  return (
    <Field>
      <RelationField
        data={skills.map((c) => ({ ...c, label: c.name }))}
        selectedIds={form.getValues("skillIds") ?? []}
        entityName="skill"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(value) => {
          const currentValues = form.getValues("skillIds");
          form.setValue(
            "skillIds",
            currentValues?.length ? currentValues?.concat(value) : [value],
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
          setOpen(false);
        }}
      />
    </Field>
  );
}
