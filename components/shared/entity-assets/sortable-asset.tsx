import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Asset } from "@/lib/dto/asset";

export function SortableAsset({
  asset,
  compact,
  isFeatured,
  updatePermissions,
  onPreview,
  onSetAsFeatured,
  onRemove,
}: {
  asset: Asset;
  compact: boolean;
  isFeatured: boolean;
  updatePermissions: boolean;
  onPreview: (asset: Asset) => void;
  onSetAsFeatured: (asset: Asset) => void;
  onRemove: (asset: Asset) => void;
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
                    border rounded-md overflow-hidden cursor-grab
                    ${isFeatured ? "border-primary ring-1 ring-primary/30" : "border-border"}
                    ${updatePermissions ? "hover:border-muted-foreground" : ""}
                    ${isDragging ? "opacity-50 cursor-grabbing" : ""}
                `}
      >
        <Image
          src={asset.sourceIdentifier}
          alt={asset.name}
          width={50}
          height={50}
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
              <DropdownMenuItem onClick={() => onPreview(asset)}>
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isFeatured}
                onClick={() => onSetAsFeatured(asset)}
              >
                Set as featured asset
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onRemove(asset)}
              >
                Remove asset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
