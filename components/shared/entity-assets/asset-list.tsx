import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type { Asset } from "@/lib/dto/asset";
import type { EntityAssetAction } from "./entity-assets";
import { SortableAsset } from "./sortable-asset";

interface AssetListProps {
  assets: Asset[];
  compact: boolean;
  sensors: ReturnType<typeof useSensors>;
  updatePermissions: boolean;
  isFeatured: (asset: Asset) => boolean;
  onSetAsFeatured: (asset: Asset) => void;
  onRemove: (asset: Asset) => void;
  onDragEnd: (event: DragEndEvent) => void;
  actions?: EntityAssetAction[];
}

export function AssetList({
  assets,
  compact,
  sensors,
  updatePermissions,
  isFeatured,
  onSetAsFeatured,
  onRemove,
  onDragEnd,
  actions,
}: AssetListProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className={`${compact ? "max-h-32" : ""} overflow-auto p-1`}>
        <SortableContext
          items={assets.map((asset) => asset.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => (
              <SortableAsset
                key={asset.id}
                asset={asset}
                compact={compact}
                isFeatured={isFeatured(asset)}
                updatePermissions={updatePermissions}
                onSetAsFeatured={onSetAsFeatured}
                onRemove={onRemove}
                actions={actions}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}
