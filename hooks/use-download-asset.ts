import React from "react";
import { toast } from "sonner";
import type { DownloadAssetOutputSchema } from "@/lib/dto/asset";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

export function useDownloadAsset() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  async function downloadAsset(id: string, filename: string) {
    try {
      setIsDownloading(true);

      const getDownloadUrlResponse = await api(
        {
          ...apiRoutes.assets.getDownloadUrl,
          url: apiRoutes.assets.getDownloadUrl.url(id),
        },
        undefined,
        false,
      );

      if (!getDownloadUrlResponse.ok) {
        throw new Error("Failed to get download url");
      }

      const downloadUrlData =
        (await getDownloadUrlResponse.json()) as DownloadAssetOutputSchema;

      if (isAppError(downloadUrlData)) {
        throw downloadUrlData;
      }

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
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDownloading(false);
    }
  }

  return {
    downloadAsset,
    isDownloading,
  };
}
