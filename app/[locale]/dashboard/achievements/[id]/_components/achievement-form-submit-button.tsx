"use client";
import { useMutationState } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NEW_ENTITY_PATH } from "@/lib/constants";

export function AchievementFormSubmitButton() {
  const form = useFormContext();
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;

  const mutationState = useMutationState({
    filters: {
      mutationKey: ["create-achievement", "update-achievement"],
    },
  });

  const isPending =
    mutationState[0]?.status === "pending" || form.formState.isSubmitting;

  return (
    <Button type="submit" form="achievement-form" disabled={isPending}>
      {creatingNewEntity ? "Create Achievement" : "Update Achievement"}
    </Button>
  );
}
