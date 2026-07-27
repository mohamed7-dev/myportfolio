"use client";
import { useMutationState } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NEW_ENTITY_PATH } from "@/lib/constants";

export function SubmitButton() {
  const form = useFormContext();
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;

  const mutationState = useMutationState({
    filters: { mutationKey: ["create-project", "update-project"] },
  });

  const isPending =
    mutationState[0]?.status === "pending" || form.formState.isSubmitting;

  return (
    <Button type="submit" form="project-form" disabled={isPending}>
      {creatingNewEntity ? "Create Project" : "Update Project"}
    </Button>
  );
}
