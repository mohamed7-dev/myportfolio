import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Asset } from "@/lib/dto/asset";
import { AssetDisplay } from "../assets/asset-display";
import type { EntityAssetAction } from "./entity-assets";

const FEATURED_ACTION_ORDER = 100;
const REMOVE_ACTION_ORDER = 200;

export function SortableAsset({
  asset,
  compact,
  isFeatured,
  updatePermissions,
  onSetAsFeatured,
  onRemove,
  actions,
}: {
  asset: Asset;
  compact: boolean;
  isFeatured: boolean;
  updatePermissions: boolean;
  onSetAsFeatured: (asset: Asset) => void;
  onRemove: (asset: Asset) => void;
  actions?: EntityAssetAction[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: asset.id,
    disabled: !updatePermissions,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const menuActions = [
    {
      order: FEATURED_ACTION_ORDER,
      content: (
        <DropdownMenuItem
          key="set-as-featured"
          disabled={isFeatured}
          onClick={() => onSetAsFeatured(asset)}
        >
          Set as featured asset
        </DropdownMenuItem>
      ),
    },
    {
      order: REMOVE_ACTION_ORDER,
      content: (
        <DropdownMenuItem
          key="remove"
          className="text-destructive"
          onClick={() => onRemove(asset)}
        >
          Remove asset
        </DropdownMenuItem>
      ),
    },
    ...(actions ?? []).map((action, index) => {
      const Action = action.component;
      return {
        order: action.order ?? 10_000,
        content: <Action key={`custom-action-${index}`} asset={asset} />,
      };
    }),
  ].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      {...attributes}
    >
      {/* Draggable Image Area */}
      <div
        {...listeners}
        className={`
                    flex items-center justify-center
                    ${compact ? "w-12 h-12" : "w-16 h-16"}
                    border rounded-base overflow-hidden cursor-grab
                    ${isFeatured ? "border-primary ring-1 ring-primary/30" : "border-border"}
                    ${updatePermissions ? "hover:border-muted-foreground" : ""}
                    ${isDragging ? "opacity-50 cursor-grabbing" : ""}
                `}
      >
        <AssetDisplay
          asset={asset}
          image={{ transform: { preset: "tiny", mode: "resize" } }}
          containerClassName="flex items-center"
        />
      </div>

      {/* Menu Trigger */}
      {updatePermissions && (
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-6 w-6 rounded-full"
              >
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuActions.map((action) => action.content)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
