"use client";
import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScopedI18n } from "@/i18n/client";
import type { GetPublicContactMethodsOutputSchema } from "@/lib/dto/visitor";
import { cn } from "@/lib/utils";

export function ContactMethodCopy({
  contactMethod,
  showInput,
  containerClassName,
}: {
  contactMethod: GetPublicContactMethodsOutputSchema["items"][number];
  showInput?: boolean;
  containerClassName?: HTMLDivElement["className"];
}) {
  const i18n = useScopedI18n("contact");
  const copy = React.useCallback(async () => {
    if (contactMethod.copyableText) {
      await navigator.clipboard
        .writeText(contactMethod.copyableText)
        .then(() => {
          toast.success(i18n("contactMethods.copiedToClipboard"));
        });
    }
  }, [contactMethod, i18n]);
  if (!contactMethod) return null;
  return (
    <div className={cn("flex items-center gap-2 p-2", containerClassName)}>
      {showInput && (
        <Input
          readOnly={true}
          defaultValue={contactMethod.copyableText ?? undefined}
        />
      )}
      <Button
        size={"icon-sm"}
        variant={"neutral"}
        className="rounded-base"
        onClick={copy}
      >
        <CopyIcon />
      </Button>
    </div>
  );
}
