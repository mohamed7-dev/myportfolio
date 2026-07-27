"use client";

import { useMutationState } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const form = useForm();
  const mutationState = useMutationState({
    filters: { mutationKey: ["update-asset"] },
  });
  const isPending =
    mutationState[0]?.status === "pending" || form.formState.isSubmitting;

  return (
    <Button type="submit" form="update-asset-form" disabled={isPending}>
      Update Asset
    </Button>
  );
}
