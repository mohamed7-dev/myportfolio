"use client";
import { VideoIcon } from "lucide-react";
import type React from "react";
import { getCloudinaryAssetUrl } from "@/lib/helpers/cloudinary-url";
import { resolveSize } from "@/lib/helpers/image";
import type { AssetLike, ImageMode, ImagePreset } from "@/lib/types/image";
import { cn } from "@/lib/utils";
import { VideoPlayer } from "./video-player/video-player";
import { isDevelopmentMode } from "@/lib/utils/is-env";

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

  const size = isDevelopmentMode()
    ? { width: asset?.width, height: asset?.height }
    : resolveSize(preset, width, height);

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
    <VideoPlayer
      controls
      preload="metadata"
      poster={
        isDevelopmentMode()
          ? `/object-storage/${asset.previewIdentifier}`
          : getCloudinaryAssetUrl(asset.previewIdentifier, "image", ["f_auto"])
      }
      width={videoWidth}
      height={videoHeight}
      {...props}
      className={cn("size-full object-contain", className)}
    >
      <source
        src={
          isDevelopmentMode()
            ? `/object-storage/${asset.sourceIdentifier}`
            : getCloudinaryAssetUrl(asset.sourceIdentifier, "video", [
                `c_${mode === "resize" ? "fit" : "fill"}`,
                `q_${quality ?? "auto"}`,
                `w_${videoWidth}`,
                `h_${videoHeight}`,
              ])
        }
      />
    </VideoPlayer>
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
