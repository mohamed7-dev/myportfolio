"use client";
import { useRef, useState } from "react";
import { AppImage } from "@/components/shared/app-image";
import type { Asset } from "@/lib/dto/asset";

type StackedImagesProps = {
  assets: Asset[];
};

export function StackedImages({ assets }: StackedImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX.current;

    setDragX(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    setCurrentIndex((index) => (index + 1) % assets.length);

    setDragX(0);
  };

  return (
    <div className="relative size-full">
      {assets
        .map((image, index) => {
          const relativeIndex =
            (index - currentIndex + assets.length) % assets.length;

          // Only render the top few cards
          if (relativeIndex > 2) return null;

          const isTop = relativeIndex === 0;

          return (
            <div
              key={image.id}
              className="w-full aspect-video absolute inset-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-base border-2 border-border"
              style={{
                zIndex: assets.length - relativeIndex,
                transform: isTop
                  ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                  : `translateY(${relativeIndex * 20}px) scale(${
                      1 - relativeIndex * 0.05
                    })`,

                transition:
                  isDragging && isTop ? "none" : "transform 300ms ease",

                cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",

                touchAction: "pan-y",
              }}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerUp : undefined}
              onPointerCancel={isTop ? handlePointerUp : undefined}
            >
              <AppImage
                asset={image}
                transform={{ preset: "thumb", mode: "resize" }}
                className="size-full object-cover select-none"
              />
            </div>
          );
        })
        .reverse()}
    </div>
  );
}
