"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { RelationField } from "@/components/data-input/relation-field";
import { Field } from "@/components/ui/field";
import type { Career } from "@/lib/dto/career";

export function ProjectFormCareerField({ careers }: { careers: Career[] }) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Field>
      <RelationField
        data={careers.map((c) => ({ ...c, label: c.name }))}
        selectedIds={[form.getValues("careerId")]}
        entityName="career"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(value) => {
          form.setValue("careerId", value ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setOpen(false);
        }}
      />
    </Field>
  );
}
