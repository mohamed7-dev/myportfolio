"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExpandIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDownloadAsset } from "@/hooks/use-download-asset";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { EntityAsset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { AppVideo } from "./app-video";

interface MediaGalleryProps {
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
    downloadAsset(``, currentItem.asset.name);
  };

  return (
    <>
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

        <div className="flex items-center justify-between p-4">
          <Badge variant={"neutral"}>
            {currentIndex + 1}/{mediaItems.length}
          </Badge>

          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="neutralNoShadow"
              className="pointer-events-auto"
              onClick={() => updateIndex(currentIndex - 1)}
              aria-label="Previous media"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              size="icon"
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
                // TODO: localize
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeFullscreen()}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[80vw]! rounded-none border-0 bg-transparent p-0 shadow-none"
        >
          <div className="relative flex flex-col overflow-hidden rounded-base border-2 border-border bg-background">
            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <Button
                type="button"
                size="icon-sm"
                variant="neutral"
                onClick={closeFullscreen}
                aria-label="Close fullscreen media"
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <div className="max-w-[80vw] max-h-[80vh] flex items-center justify-center bg-background">
              {(currentItem.asset.type === ObjectStorageResourceType.image ||
                currentItem.asset.type === ObjectStorageResourceType.raw) && (
                <AppImage
                  asset={currentItem.asset}
                  transform={{
                    preset: "full",
                  }}
                  loading="eager"
                  className="size-full object-contain"
                />
              )}
              {currentItem.asset.type === ObjectStorageResourceType.video && (
                <AppVideo
                  asset={currentItem.asset}
                  transform={{
                    preset: "full",
                  }}
                  className={cn(
                    "size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                  )}
                />
              )}
            </div>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
              <Button
                type="button"
                size="icon"
                variant="neutralNoShadow"
                onClick={() => updateIndex(currentIndex - 1)}
                aria-label="Previous media"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="neutralNoShadow"
                onClick={() => updateIndex(currentIndex + 1)}
                aria-label="Next media"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
          <DialogHeader className="sr-only">
            <DialogTitle>{title ?? "Media gallery"}</DialogTitle>
            <DialogDescription>Media gallery</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
