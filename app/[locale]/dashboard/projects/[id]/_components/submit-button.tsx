"use client";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NEW_ENTITY_PATH } from "@/lib/constants";

export function SubmitButton() {
  const form = useFormContext();
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;

  const isPending = form.formState.isSubmitting; // TODO: replace with actual mutation pending state

  return (
    <Button type="submit" form="project-form" disabled={isPending}>
      {creatingNewEntity ? "Create Project" : "Update Project"}
    </Button>
  );
}
