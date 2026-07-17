import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  type useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Asset } from "@/lib/dto/asset";
import { SortableAsset } from "./sortable-asset";

interface AssetListProps {
  assets: Asset[];
  compact: boolean;
  sensors: ReturnType<typeof useSensors>;
  updatePermissions: boolean;
  isFeatured: (asset: Asset) => boolean;
  onPreview: (asset: Asset) => void;
  onSetAsFeatured: (asset: Asset) => void;
  onRemove: (asset: Asset) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function AssetList({
  assets,
  compact,
  sensors,
  updatePermissions,
  isFeatured,
  onPreview,
  onSetAsFeatured,
  onRemove,
  onDragEnd,
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
                onPreview={onPreview}
                onSetAsFeatured={onSetAsFeatured}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}
