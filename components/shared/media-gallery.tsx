"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExpandIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import { useDownloadAsset } from "@/hooks/use-download-asset";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { EntityAsset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { AppVideo } from "./app-video";
import { DynamicLoader } from "./dynamic-loader";

const MediaGalleryDialog = dynamic(
  () => import("./media-gallery-dialog").then((mod) => mod.MediaGalleryDialog),
  {
    loading: () => (
      <div className="fixed z-50 inset-0 bg-overlay/60 h-screen w-screen flex items-center justify-center text-primary">
        <DynamicLoader />
      </div>
    ),
  },
);

export interface MediaGalleryProps {
  entityAssets: EntityAsset[];
  title?: string;
  className?: string;
  staticImageProps?: Partial<React.ComponentProps<typeof AppImage>>;
  overlayImageProps?: Partial<React.ComponentProps<typeof AppImage>>;
}

export function MediaGallery({
  entityAssets,
  title,
  className,
  staticImageProps,
  overlayImageProps,
}: MediaGalleryProps) {
  const mediaItems = entityAssets.filter((entry) => !!entry.asset) ?? [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { downloadAsset, isDownloading } = useDownloadAsset();

  if (!mediaItems.length) {
    return null;
  }

  const currentItem = mediaItems[currentIndex];

  const updateIndex = (nextIndex: number) => {
    setCurrentIndex((nextIndex + mediaItems.length) % mediaItems.length);
  };

  const openFullscreen = () => {
    setDialogOpen(true);
  };

  const closeFullscreen = () => {
    setDialogOpen(false);
  };

  const downloadFile = () => {
    downloadAsset(currentItem.asset.id, currentItem.asset.name);
  };

  return (
    <React.Fragment>
      <div
        className={cn(
          "group relative w-full overflow-hidden space-y-4 rounded-base border-2 border-border bg-background",
          className,
        )}
      >
        <div className="relative aspect-video overflow-hidden bg-secondary-background">
          {mediaItems.map((entry, index) => {
            const offset = index - currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={entry.asset.id}
                className={cn(
                  "absolute inset-0 z-10 transition-all duration-500 ease-out",
                  isCurrent
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                )}
                style={{
                  transform: `translateX(${offset * 100}%) scale(${isCurrent ? 1 : 0.94})`,
                }}
              >
                {(entry.asset.type === ObjectStorageResourceType.image ||
                  entry.asset.type === ObjectStorageResourceType.raw) && (
                  <AppImage
                    asset={entry.asset}
                    transform={{
                      preset: "full",
                    }}
                    className={cn(
                      "size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                      !isCurrent && "brightness-75",
                    )}
                    alt={entry.asset.name ?? title ?? "Media asset"}
                    {...staticImageProps}
                  />
                )}
                {entry.asset.type === ObjectStorageResourceType.video && (
                  <AppVideo
                    asset={entry.asset}
                    transform={{
                      preset: "large",
                      mode: "resize",
                    }}
                    className={cn(
                      "size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                      !isCurrent && "brightness-75",
                    )}
                  />
                )}
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
        </div>

        <div className="flex items-center justify-between p-2 md:p-4">
          <Badge variant={"neutral"}>
            {currentIndex + 1}/{mediaItems.length}
          </Badge>

          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon-sm"
              variant="neutralNoShadow"
              className="pointer-events-auto"
              onClick={() => updateIndex(currentIndex - 1)}
              aria-label="Previous media"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="neutralNoShadow"
              className="pointer-events-auto"
              onClick={() => updateIndex(currentIndex + 1)}
              aria-label="Next media"
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2">
            {currentItem.asset.type === ObjectStorageResourceType.raw && (
              <Button
                type="button"
                size="icon-sm"
                variant="neutral"
                className="pointer-events-auto"
                onClick={downloadFile}
                aria-label="Download file"
                disabled={isDownloading}
              >
                <DownloadIcon className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              size="icon-sm"
              variant="neutral"
              className="pointer-events-auto"
              onClick={openFullscreen}
              aria-label="Open media gallery fullscreen"
            >
              <ExpandIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <MediaGalleryDialog
          dialogOpen={dialogOpen}
          closeFullscreen={closeFullscreen}
          currentItem={currentItem}
          onClickNext={() => currentIndex + 1}
          onClickPrev={() => currentIndex - 1}
          dialogTitle={title}
          imageProps={overlayImageProps}
        />
      )}
    </React.Fragment>
  );
}
