"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GetPublicProjectOutputSchema } from "@/lib/dto/visitor";
import { cn } from "@/lib/utils";

export function MediaGallery({
  project,
}: {
  project: GetPublicProjectOutputSchema;
}) {
  const assets = project?.assets?.filter((entry) => !!entry?.asset) ?? [];
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [originRect, setOriginRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  if (!assets.length) {
    return null;
  }

  const currentAsset = assets[currentIndex];

  const updateIndex = (nextIndex: number, nextDirection: "left" | "right") => {
    setDirection(nextDirection);
    setCurrentIndex((nextIndex + assets.length) % assets.length);
  };

  const openFullscreen = () => {
    const rect = mediaRef.current?.getBoundingClientRect();
    if (!rect) {
      setDialogOpen(true);
      return;
    }

    setOriginRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setIsExpanding(false);
    setDialogOpen(true);

    requestAnimationFrame(() => {
      setIsExpanding(true);
    });
  };

  const closeFullscreen = () => {
    setIsExpanding(false);
    setDialogOpen(false);
  };

  const dialogStyle =
    originRect && dialogOpen
      ? ({
          position: "fixed",
          left: isExpanding ? "50%" : `${originRect.left}px`,
          top: isExpanding ? "50%" : `${originRect.top}px`,
          width: isExpanding ? "min(90vw, 1100px)" : `${originRect.width}px`,
          height: isExpanding ? "min(80vh, 820px)" : `${originRect.height}px`,
          transform: isExpanding ? "translate(-50%, -50%)" : "translate(0, 0)",
          transition: "all 420ms cubic-bezier(0.22, 1, 0.36, 1)",
          transformOrigin: "center center",
          zIndex: 60,
        } as React.CSSProperties)
      : undefined;

  return (
    <>
      <div className="group relative w-full overflow-hidden rounded-base border-2 border-border bg-background shadow-default">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary-background">
          {assets.map((entry, index) => {
            const offset = index - currentIndex;
            const isCurrent = index === currentIndex;
            const slideLeft = direction === "left";

            return (
              <div
                key={entry.asset.id}
                className={cn(
                  "absolute inset-0 transition-all duration-500 ease-out",
                  isCurrent
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                )}
                style={{
                  transform: `translateX(${offset * 100}%) scale(${isCurrent ? 1 : 0.94})`,
                }}
              >
                <AppImage
                  asset={entry.asset}
                  width={entry.asset.width}
                  height={entry.asset.height}
                  className={cn(
                    "size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                    !isCurrent && "brightness-75",
                    slideLeft ? "" : "",
                  )}
                  alt={entry.asset.name ?? project.name}
                />
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
            <div className="rounded-full border-2 border-border bg-background/80 px-2 py-1 text-[10px] font-heading uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
              {currentIndex + 1}/{assets.length}
            </div>
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

          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
            <Button
              type="button"
              size="icon"
              variant="neutralNoShadow"
              className="pointer-events-auto"
              onClick={() => updateIndex(currentIndex - 1, "right")}
              aria-label="Previous media"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="neutralNoShadow"
              className="pointer-events-auto"
              onClick={() => updateIndex(currentIndex + 1, "left")}
              aria-label="Next media"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <div
          ref={mediaRef}
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
        />
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeFullscreen()}
      >
        <DialogContent
          showCloseButton={false}
          className="!z-[60] !m-0 !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !bg-transparent !p-0 !shadow-none"
          style={dialogStyle}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-base border-2 border-border bg-background">
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

            <div className="relative flex h-full w-full items-center justify-center bg-secondary-background">
              <AppImage
                asset={currentAsset.asset}
                width={currentAsset.asset.width}
                height={currentAsset.asset.height}
                className="size-full object-contain"
                alt={currentAsset.asset.name ?? project.name}
              />
            </div>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
              <Button
                type="button"
                size="icon"
                variant="neutralNoShadow"
                onClick={() => updateIndex(currentIndex - 1, "right")}
                aria-label="Previous media"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="neutralNoShadow"
                onClick={() => updateIndex(currentIndex + 1, "left")}
                aria-label="Next media"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
          <DialogHeader className="sr-only">
            <DialogTitle>{project.name}</DialogTitle>
            <DialogDescription>Project media gallery</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
