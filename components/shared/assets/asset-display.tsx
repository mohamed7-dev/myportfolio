import Image from "next/image";
import type React from "react";
import type { Asset } from "@/lib/dto/asset";

export function AssetDisplay({
  asset,
  image,
}: {
  asset: Asset;
  image: Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
}) {
  return <Image {...image} alt={asset.name} src={asset.previewIdentifier} />;
}
