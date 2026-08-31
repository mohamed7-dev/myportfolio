"use client";
import { ImageIcon } from "lucide-react";
import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import type React from "react";
import { getCloudinaryAssetUrl } from "@/lib/helpers/cloudinary-url";
import { resolveSize } from "@/lib/helpers/image";
import type {
  AssetLike,
  ImageFormat,
  ImageMode,
  ImagePreset,
} from "@/lib/types/image";
import { cn } from "@/lib/utils";
import { isDevelopmentMode } from "@/lib/utils/is-env";

type ImageCompProps = Omit<ImageProps, "src" | "placeholder" | "alt">;

type AppImageProps = ImageCompProps & {
  asset: AssetLike | undefined;
  placeholder?: React.ReactNode;
  width?: number;
  height?: number;
  transform?: {
    preset?: ImagePreset;
    mode?: ImageMode;
    format?: ImageFormat;
    quality?: number;
  };
  ref?: React.Ref<HTMLImageElement>;
  alt?: string;
};

export function AppImage({
  ref,
  asset,
  placeholder,
  transform = {},
  width,
  height,
  alt,
  className,
  ...props
}: AppImageProps) {
  const { quality, preset = null, mode = null, format = null } = transform;

  const size = isDevelopmentMode()
    ? { width: asset?.width, height: asset?.height }
    : resolveSize(preset, width, height);

  if (!asset) {
    return (
      placeholder ?? (
        <PlaceholderImage
          preset={preset}
          width={size.width}
          height={size.height}
          className={className}
        />
      )
    );
  }

  if (isDevelopmentMode()) {
    return (
      <Image
        ref={ref}
        src={`/object-storage/${asset.previewIdentifier}`}
        alt={alt ?? asset.name ?? ""}
        width={size.width === undefined ? asset.width : size.width}
        height={size.height === undefined ? asset.height : size.height}
        className={cn("rounded-base size-auto", className)}
        quality={quality as any}
        {...props}
      />
    );
  }

  const cloudinaryLoader = ({
    src,
    width: requestedWidth,
    quality,
  }: ImageLoaderProps) => {
    const publicId = src.split("/upload/").at(-1) ?? asset.previewIdentifier;

    return getCloudinaryAssetUrl(publicId, "image", [
      `f_${format ?? "auto"}`,
      `q_${quality ?? "auto"}`,
      `c_${mode === "resize" ? "fit" : "fill"}`,
      `w_${requestedWidth}`,
    ]);
  };

  return (
    <Image
      ref={ref}
      src={getCloudinaryAssetUrl(asset.previewIdentifier, "image")}
      alt={alt ?? asset.name ?? ""}
      width={size.width === undefined ? asset.width : size.width}
      height={size.height === undefined ? asset.height : size.height}
      className={cn("rounded-base size-auto", className)}
      loading="lazy"
      loader={cloudinaryLoader}
      quality={quality}
      {...props}
    />
  );
}

interface PlaceholderImageProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: ImagePreset;
  width?: number;
  height?: number;
}

export function PlaceholderImage({
  preset = null,
  width,
  height,
  className,
  style,
  ...props
}: PlaceholderImageProps) {
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
      <ImageIcon className="size-full text-foreground" />
    </div>
  );
}
