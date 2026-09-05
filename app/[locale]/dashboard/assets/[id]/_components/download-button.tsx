"use client";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDownloadAsset } from "@/hooks/use-download-asset";
import type { Asset } from "@/lib/dto/asset";

export function DownloadButton({ asset }: { asset: Asset }) {
  const { downloadAsset, isDownloading } = useDownloadAsset();
  const form = useFormContext();
  return (
    <Button
      variant={"neutral"}
      onClick={() => downloadAsset(asset.id, asset.name)}
      disabled={isDownloading || form.formState.isSubmitting}
    >
      {isDownloading ? <Loader2Icon /> : <DownloadIcon />}
      Download{isDownloading && "ing"} Asset
    </Button>
  );
}
