import { ImageIcon } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import type React from "react";
import { buildImageUrl, resolveSize } from "@/lib/helpers/image";
import type {
  AssetLike,
  ImageFormat,
  ImageMode,
  ImagePreset,
} from "@/lib/types/image";
import { cn } from "@/lib/utils";

interface AppImageProps
  extends Omit<ImageProps, "src" | "placeholder" | "alt"> {
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
  alt?: ImageProps["alt"];
}

export function AppImage({
  ref,
  asset,
  placeholder,
  transform = {},
  width,
  height,
  alt,
  className,
  style,
  ...props
}: AppImageProps) {
  const { quality, preset = null, mode = null, format = null } = transform;
  if (!asset) {
    return (
      placeholder ?? (
        <PlaceholderImage
          preset={preset}
          width={width}
          height={height}
          className={className}
        />
      )
    );
  }

  const size = resolveSize(preset, width, height);

  return (
    <Image
      ref={ref}
      src={buildImageUrl(asset, {
        preset,
        mode,
        format,
        width,
        height,
        quality,
      })}
      alt={alt ?? asset.name ?? ""}
      width={size.width}
      height={size.height}
      className={cn("rounded-base", className)}
      loading="lazy"
      style={style}
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
        "rounded-base flex items-center justify-center bg-secondary-background",
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
