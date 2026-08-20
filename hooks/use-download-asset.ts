import React from "react";
import type { DownloadAssetOutputSchema } from "@/lib/dto/asset";
import { apiUrl } from "@/lib/helpers/router";

export function useDownloadAsset() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  async function downloadAsset(id: string, filename: string) {
    try {
      setIsDownloading(true);

      const getDownloadUrlResponse = await fetch(
        apiUrl(`assets/${id}/download`),
      );

      if (!getDownloadUrlResponse.ok) {
        throw new Error("Failed to get download url");
      }

      const downloadUrlData =
        (await getDownloadUrlResponse.json()) as DownloadAssetOutputSchema;

      const downloadRes = await fetch(downloadUrlData.downloadUrl);

      if (!downloadRes.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await downloadRes.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsDownloading(false);
    }
  }

  return {
    downloadAsset,
    isDownloading,
  };
}
