"use client";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useScopedI18n } from "@/i18n/client";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { EntityAsset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AppImage } from "./app-image";
import { AppVideo } from "./app-video";
import type { MediaGalleryProps } from "./media-gallery";

interface MediaGalleryDialogProps {
  dialogOpen: boolean;
  closeFullscreen: () => void;
  currentItem: EntityAsset;
  onClickNext: () => void;
  onClickPrev: () => void;
  dialogTitle?: string;
  imageProps?: MediaGalleryProps["overlayImageProps"];
}

export function MediaGalleryDialog({
  dialogOpen,
  closeFullscreen,
  currentItem,
  onClickNext,
  onClickPrev,
  dialogTitle,
  imageProps,
}: MediaGalleryDialogProps) {
  const { className, ...rest } = imageProps ?? {};
  const i18n = useScopedI18n("mediaGallery");
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => !open && closeFullscreen()}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[98vw]! lg:max-w-[80vw]! rounded-none border-0 bg-transparent p-0 shadow-none"
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

          <div className="flex items-center justify-center bg-background">
            {(currentItem.asset.type === ObjectStorageResourceType.image ||
              currentItem.asset.type === ObjectStorageResourceType.raw) && (
              <AppImage
                asset={currentItem.asset}
                transform={{
                  preset: "full",
                }}
                loading="eager"
                className={cn("size-full object-contain", className)}
                {...rest}
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
              onClick={onClickPrev}
              aria-label="Previous media"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="neutralNoShadow"
              onClick={onClickNext}
              aria-label="Next media"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
        <DialogHeader className="sr-only">
          <DialogTitle>{dialogTitle ?? i18n("dialogTitle")}</DialogTitle>
          <DialogDescription>{i18n("dialogDescription")}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
