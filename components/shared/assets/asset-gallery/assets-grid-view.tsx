import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/format-bytes";
import { AssetDisplay } from "../asset-display";
import type { Asset } from "./asset-gallery";

export interface AssetViewProps {
  assets: Asset[];
  isLoading: boolean;
  isAssetSelected: (asset: Asset) => boolean;
  toggleSelection: (asset: Asset) => void;
  onAssetClick: (
    asset: Asset,
    event: React.MouseEvent | React.KeyboardEvent,
  ) => void;
}
export function AssetGridView(props: AssetViewProps) {
  if (props.isLoading) {
    return <AssetsLoader />;
  }

  if (props.assets.length === 0) {
    return <AssetEmpty />;
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-1">
      {props.assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          selected={props.isAssetSelected(asset)}
          onSelect={props.onAssetClick}
          onToggleSelection={props.toggleSelection}
        />
      ))}
    </div>
  );
}

export function AssetsLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2Icon className="size-10 animate-spin" />
      <span className="sr-only">Loading assets...</span>
    </div>
  );
}

export function AssetEmpty() {
  return (
    <div className="flex items-center justify-center py-12 text-foreground font-base">
      No assets found. Try adjusting your filters or search input.
    </div>
  );
}

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect(asset: Asset, e: React.MouseEvent | React.KeyboardEvent): void;
  onToggleSelection(asset: Asset): void;
}

export function AssetCard({
  asset,
  selected,
  onSelect,
  onToggleSelection,
}: AssetCardProps) {
  const cardClasses = cn(
    "relative",
    "group",
    "rounded-base",
    "border-2 border-border",
    "bg-secondary-background",
    "shadow-default",
    "transition-all duration-200",
    "hover:translate-x-box-shadow-x",
    "hover:translate-y-box-shadow-y",
    "hover:shadow-none",
    "focus:ring-2",
    "focus:ring-ring",
    "focus:ring-offset-2",
  );
  return (
    <div className={cardClasses}>
      <button
        type="button"
        className="w-full"
        onClick={(e) => onSelect(asset, e)}
      >
        <AssetThumbnail asset={asset} />
        <Separator />
        <AssetCardFooter asset={asset} />
      </button>
      <div className="absolute left-2 top-2">
        <AssetSelection
          checked={selected}
          onChange={() => {
            onToggleSelection(asset);
          }}
        />
      </div>
      <AssetNavigateAction
        id={asset.id}
        className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
}

export function AssetCardFooter({ asset }: { asset: Asset }) {
  return (
    <footer className="flex flex-col gap-4 p-2">
      <p className="line-clamp-1 text-sm" title={asset.name}>
        {asset.name}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs">
          {asset.fileSize ? formatBytes(asset.fileSize) : null}
        </span>
      </div>
    </footer>
  );
}

export function AssetNavigateAction({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <Button variant="noShadow" size="icon-sm" className={cn(className)} asChild>
      <Link
        href={`/dashboard/assets/${id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronRightIcon />
      </Link>
    </Button>
  );
}

export function AssetThumbnail({ asset }: { asset: Asset }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-background">
      <AssetDisplay
        asset={asset}
        image={{
          loading: "eager",
          fill: true,
          sizes: "15vw",
          className: "absolute size-full object-cover",
        }}
      />
    </div>
  );
}

export function AssetSelection({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange(): void;
}) {
  return (
    <Checkbox
      checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    />
  );
}
