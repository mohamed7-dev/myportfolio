import Image from "next/image";
import type React from "react";
import type { Asset } from "@/lib/dto/asset";
import { cn } from "@/lib/utils";

export function AssetDisplay({
  asset,
  image,
}: {
  asset: Asset;
  image: Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
}) {
  return (
    <div
      className={cn(
        "w-fit",
        asset.mimetype.includes("png") &&
          "bg-secondary-background rounded-base",
      )}
    >
      <Image {...image} alt={asset.name} src={asset.previewIdentifier} />
    </div>
  );
}
