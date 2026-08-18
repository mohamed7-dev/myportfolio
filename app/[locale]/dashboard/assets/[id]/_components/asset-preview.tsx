"use client";
import { AppImage } from "@/components/shared/app-image";
import { AppVideo } from "@/components/shared/app-video";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { Asset } from "@/lib/dto/asset";

export function AssetPreview({ asset }: { asset: Asset }) {
  return (
    <div className="relative flex items-center justify-center bg-background rounded-base min-h-75 overflow-auto resize-y">
      {asset.type === ObjectStorageResourceType.video && (
        <AppVideo
          asset={asset}
          transform={{ preset: "full" }}
          className="size-full object-contain"
        />
      )}
      {(asset.type === ObjectStorageResourceType.image ||
        asset.type === ObjectStorageResourceType.raw) && (
        <AppImage
          asset={asset}
          transform={{ preset: "full" }}
          loading="eager"
          className="max-w-full object-contain"
        />
      )}
    </div>
  );
}
