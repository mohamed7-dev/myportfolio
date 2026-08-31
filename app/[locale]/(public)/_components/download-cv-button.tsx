"use client";
import { useTransition } from "react";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { Button } from "@/components/ui/button";
import { useDownloadAsset } from "@/hooks/use-download-asset";
import { useScopedI18n } from "@/i18n/client";

export function DownloadCvButton() {
  const i18n = useScopedI18n("home");
  const [isPending, startTransition] = useTransition();
  const ctx = usePublicLayout("HomePageHeader");
  const { downloadAsset } = useDownloadAsset();

  const downloadCv = () => {
    startTransition(async () => {
      if (!ctx.profile.cvAssetId) return;
      await downloadAsset(ctx.profile.cvAssetId, "CV");
    });
  };

  if (!ctx.profile.cvAssetId) return null;
  return (
    <Button
      size="xs"
      variant={"neutral"}
      disabled={isPending}
      onClick={downloadCv}
    >
      {i18n("cv")}
    </Button>
  );
}
