import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";

export const AssetType = {
  ...ObjectStorageResourceType,
  all: "all",
} as const;

export type AssetTypeUnion = keyof typeof AssetType;

interface ActionsBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  assetType: AssetTypeUnion;
  onAssetTypeChange: (type: AssetTypeUnion) => void;
}

export function ActionsBar({
  searchInput,
  onSearchInputChange,
  assetType,
  onAssetTypeChange,
}: ActionsBarProps) {
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
