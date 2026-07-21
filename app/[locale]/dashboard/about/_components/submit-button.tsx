"use client";
import { useMutationState } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const form = useFormContext();

  const mutationState = useMutationState({
    filters: { mutationKey: ["update-profile"] },
  });
  const isPending =
    mutationState[0]?.status === "pending" || form.formState.isSubmitting;
  return (
    <Button type="submit" form="update-profile-form" disabled={isPending}>
      Update Profile
    </Button>
  );
}
