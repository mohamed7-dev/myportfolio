"use client";
import { useMutationState } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NEW_ENTITY_PATH } from "@/lib/constants";

export function EducationFormSubmitButton() {
  const form = useFormContext();
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;

  const mutationState = useMutationState({
    filters: { mutationKey: ["create-education", "update-education"] },
  });

  const isPending =
    mutationState[0]?.status === "pending" || form.formState.isSubmitting;

  return (
    <Button type="submit" form="education-form" disabled={isPending}>
      {creatingNewEntity ? "Create Item" : "Update Item"}
    </Button>
  );
}
