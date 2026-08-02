import { ImageIcon } from "lucide-react";
import type { Asset } from "@/lib/dto/asset";
import { AssetDisplay } from "../assets/asset-display";

interface FeaturedAssetProps {
  featuredAsset?: Asset | null;
  compact?: boolean;
  onSelectAssets: () => void;
  onPreviewAsset: (asset: Asset) => void;
}

export function FeaturedAsset({
  featuredAsset,
  compact = false,
  onSelectAssets,
  onPreviewAsset,
}: FeaturedAssetProps) {
  return (
    <div
      className={`flex items-center justify-center ${compact ? "h-40" : "h-64"} border border-dashed rounded-md overflow-hidden`}
    >
      {featuredAsset ? (
        <AssetDisplay
          asset={featuredAsset}
          image={{
            fill: true,
            sizes: "15rem",
            loading: "eager",
            className: "object-contain cursor-pointer",
          }}
          containerClassName="relative"
        />
      ) : (
        // biome-ignore lint/a11y/noStaticElementInteractions: none
        <div
          className="flex flex-col items-center justify-center text-muted-foreground cursor-pointer"
          onKeyDown={(e) => e.key === "Enter" && onSelectAssets()}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: none
          tabIndex={0}
          onClick={onSelectAssets}
        >
          <ImageIcon className={compact ? "h-10 w-10" : "h-16 w-16"} />
          {!compact && <div className="mt-2">No featured asset</div>}
        </div>
      )}
    </div>
  );
}
