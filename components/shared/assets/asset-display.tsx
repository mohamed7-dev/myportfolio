import Image from "next/image";
import type React from "react";
import type { Asset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";

export function AssetDisplay({
  asset,
  image,
  containerClassName,
}: {
  asset: Asset;
  image: Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
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
      <Image {...image} alt={asset.name} src={asset.previewIdentifier} />
    </div>
  );
}
