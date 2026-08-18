"use client";
import { VideoIcon } from "lucide-react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import type React from "react";
import { resolveSize } from "@/lib/helpers/image";
import type { AssetLike, ImageMode, ImagePreset } from "@/lib/types/image";
import { cn } from "@/lib/utils";
import "next-cloudinary/dist/cld-video-player.css";
import { isDevelopmentMode } from "@/lib/helpers/env";

interface AppVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> {
  asset: AssetLike | undefined;
  placeholder?: React.ReactNode;
  width?: number;
  height?: number;
  transform?: {
    preset?: ImagePreset;
    mode?: ImageMode;
    quality?: number;
  };
  ref?: React.Ref<HTMLVideoElement>;
}

export function AppVideo({
  ref,
  asset,
  placeholder,
  transform = {},
  width,
  height,
  className,
  controls,
  preload,
  ...props
}: AppVideoProps) {
  const { quality, preset = null, mode = null } = transform;

  const size = resolveSize(preset, width, height);

  if (!asset) {
    return (
      placeholder ?? (
        <PlaceholderVideo
          preset={preset}
          width={size.width}
          height={size.height}
          className={className}
        />
      )
    );
  }

  const videoWidth = size.width ?? asset.width;
  const videoHeight = size.height ?? asset.height;

  return (
    <video
      controls
      preload="metadata"
      poster={
        isDevelopmentMode()
          ? asset.previewIdentifier
          : getCldImageUrl({ src: asset.previewIdentifier })
      }
      {...props}
      className={cn("size-full object-cover", className)}
    >
      <source
        src={
          isDevelopmentMode()
            ? asset.sourceIdentifier
            : getCldVideoUrl({
                src: asset.sourceIdentifier,
                crop: mode === "resize" ? "fit" : "fill",
                quality,
                width: videoWidth,
                height: videoHeight,
                // streamingProfile: "hd",
                // transformations: ["hls"],
              })
        }
        type={asset.mimetype}
      />
    </video>
  );
}

interface PlaceholderVideoProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: ImagePreset;
  width?: number;
  height?: number;
}

export function PlaceholderVideo({
  preset = null,
  width,
  height,
  className,
  style,
  ...props
}: PlaceholderVideoProps) {
  const size = resolveSize(preset, width, height);

  return (
    <div
      className={cn(
        "rounded-base flex items-center justify-center bg-background",
        className,
      )}
      style={{
        width: size.width,
        height: size.height,
        ...style,
      }}
      {...props}
    >
      <VideoIcon className="size-full p-4 text-foreground" />
    </div>
  );
}
