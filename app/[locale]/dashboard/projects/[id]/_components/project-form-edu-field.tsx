"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RelationField } from "@/components/data-input/relation-field";
import { Field } from "@/components/ui/field";
import type { Education } from "@/lib/dto/education";

export function ProjectFormEducationField({
  educationItems,
}: {
  educationItems: Education[];
}) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Field>
      <RelationField
        data={educationItems.map((c) => ({ ...c, label: c.school }))}
        selectedIds={[form.getValues("educationItemId")]}
        entityName="education"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(value) => {
          form.setValue("educationItemId", value ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setOpen(false);
        }}
      />
    </Field>
  );
}
