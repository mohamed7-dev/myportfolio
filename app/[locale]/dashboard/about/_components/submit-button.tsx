"use client";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const form = useFormContext();

  const isPending = form.formState.isSubmitting; // TODO: replace with actual mutation pending state

  return (
    <Button type="submit" form="update-profile-form" disabled={isPending}>
      Update Profile
    </Button>
  );
}
