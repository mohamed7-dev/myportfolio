"use client";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadAsset } from "@/hooks/use-download-asset";
import type { Asset } from "@/lib/dto/asset";

export function DownloadButton({ asset }: { asset: Asset }) {
  const { downloadAsset, isDownloading } = useDownloadAsset();
  return (
    <Button
      variant={"neutral"}
      onClick={() => downloadAsset(asset.sourceIdentifier, asset.name)}
      disabled={isDownloading}
    >
      {isDownloading ? <Loader2Icon /> : <DownloadIcon />}
      Download{isDownloading && "ing"} Asset
    </Button>
  );
}
