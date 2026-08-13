"use client";
import { CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GetPublicContactMethodsOutputSchema } from "@/lib/dto/visitor";

export function PrimaryContactMethodCopy({
  primaryContactMethod,
}: {
  primaryContactMethod: GetPublicContactMethodsOutputSchema["items"][number];
}) {
  const i18n = useTranslations("contact");
  const copy = React.useCallback(async () => {
    if (primaryContactMethod.copyableText) {
      await navigator.clipboard
        .writeText(primaryContactMethod.copyableText)
        .then(() => {
          toast.success(i18n("contactMethods.copiedToClipboard"));
        });
    }
  }, [primaryContactMethod, i18n]);
  if (!primaryContactMethod) return null;
  return (
    <div className="flex items-center gap-2 p-2">
      <Input
        readOnly={true}
        defaultValue={primaryContactMethod.copyableText ?? undefined}
      />
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
