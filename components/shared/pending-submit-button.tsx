"use client";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NEW_ENTITY_PATH } from "@/lib/constants";

export function PendingSubmitButton({
  formName,
  createEntityLabel,
  updateEntityLabel,
}: {
  formName: string;
  createEntityLabel: string;
  updateEntityLabel: string;
}) {
  const form = useFormContext();
  const params = useParams();
  const creatingNewEntity = params.id === NEW_ENTITY_PATH;

  const isPending = form.formState.isSubmitting;

  return (
    <Button type="submit" form={formName} disabled={isPending}>
      {creatingNewEntity ? createEntityLabel : updateEntityLabel}
    </Button>
  );
}
