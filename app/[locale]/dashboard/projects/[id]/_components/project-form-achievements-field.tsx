"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RelationField } from "@/components/data-input/relation-field";
import { Field } from "@/components/ui/field";
import type { Achievement } from "@/lib/dto/achievement";

export function ProjectFormAchievementsField({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Field>
      <RelationField
        data={achievements.map((c) => ({ ...c, label: c.name }))}
        selectedIds={[form.getValues("achievementIds")]}
        entityName="achievement"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(value) => {
          form.setValue("achievementIds", value ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setOpen(false);
        }}
      />
    </Field>
  );
}
