import { SearchIcon } from "lucide-react";
import React from "react";
import { RelationField } from "@/components/data-input/relation-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type { Tag } from "@/lib/dto/tag";
import { AssetType, type AssetTypeUnion } from "./asset-gallery";

interface ActionsBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  assetType: AssetTypeUnion;
  onAssetTypeChange: (type: AssetTypeUnion) => void;
  tags: Tag[];
}

export function ActionsBar({
  searchInput,
  onSearchInputChange,
  assetType,
  onAssetTypeChange,
  tags,
}: ActionsBarProps) {
  const [open, setOpen] = React.useState(false);
  const { searchParams, updateSearchParams } = useRouterUtils();
  const currentTag = searchParams.get("tag") ?? "";

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 relative">
        <SearchIcon className="size-4 absolute left-2 top-3" />
        <Input
          placeholder={"Search assets"}
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="ps-8"
        />
      </div>
      <RelationField
        entityName="tag"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(tag) => {
          if (tag !== currentTag) {
            updateSearchParams({ tag: tag });
          } else {
            updateSearchParams({ tag: null });
          }
        }}
        selectedIds={[tags.find((t) => t.id === currentTag)?.id ?? ""]}
        data={tags.map((t) => ({ id: t.id, label: t.value }))}
      />
      <Select
        value={assetType as AssetTypeUnion}
        onValueChange={(value) =>
          value != null && onAssetTypeChange(value as AssetTypeUnion)
        }
      >
        <SelectTrigger className="w-full md:w-45">
          <SelectValue placeholder={"Asset Type"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={AssetType.all}>All types</SelectItem>
          <SelectItem value={AssetType.image}>Images</SelectItem>
          <SelectItem value={AssetType.video}>Videos</SelectItem>
          <SelectItem value={AssetType.raw}>Binary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
