import React from "react";

export function useDownloadAsset() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  async function downloadAsset(url: string, filename: string) {
    try {
      setIsDownloading(true);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

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
