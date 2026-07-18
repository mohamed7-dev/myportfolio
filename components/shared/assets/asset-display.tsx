import { BinaryIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { type Asset, AssetType } from "@/lib/dto/asset";

export function AssetDisplay({
  asset,
  image,
}: {
  asset: Asset;
  image: Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
}) {
  return (
    <React.Fragment>
      {asset.type === AssetType.IMAGE && (
        <Image {...image} alt={asset.name} src={asset.sourceIdentifier} />
      )}
      <div className="flex items-center justify-center h-full w-full">
        {asset.type === AssetType.VIDEO && <VideoIcon className="size-20" />}
        {asset.type === AssetType.BINARY && <BinaryIcon className="size-20" />}
      </div>
    </React.Fragment>
  );
}
