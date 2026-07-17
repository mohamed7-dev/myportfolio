"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const form = useForm();
  const isPending = form.formState.isSubmitting;

  return (
    <Button type="submit" form="update-asset-form" disabled={isPending}>
      Update Asset
    </Button>
  );
}
