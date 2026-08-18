import type React from "react";
import type { Asset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";
import { AppImage } from "../app-image";

export function AssetDisplay({
  asset,
  image,
  containerClassName,
}: {
  asset: Asset;
  image: Omit<React.ComponentProps<typeof AppImage>, "asset">;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "size-full",
        asset.mimetype.includes("png") &&
          "bg-secondary-background rounded-base",
        containerClassName,
      )}
    >
      <AppImage {...image} asset={asset} />
    </div>
  );
}
