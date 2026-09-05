import { SearchIcon } from "lucide-react";
import React from "react";
import { EntityRelation } from "@/components/data-input/entity-relation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tag, TagListOutputSchema } from "@/lib/dto/tag";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";
import { AssetType, type AssetTypeUnion } from "./asset-gallery";

interface ActionsBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  assetType: AssetTypeUnion;
  onAssetTypeChange: (type: AssetTypeUnion) => void;
  tags: Tag[];
  onSelectingTag: (value: string) => void;
  currentTag?: string;
}

export function ActionsBar({
  searchInput,
  onSearchInputChange,
  assetType,
  onAssetTypeChange,
  tags,
  onSelectingTag,
  currentTag,
}: ActionsBarProps) {
  const [open, setOpen] = React.useState(false);

  const queryFn = async (
    page: number,
    pageSize: number,
    searchTerm: string,
  ) => {
    const filter: Record<string, any> = {};

    if (searchTerm) {
      filter.value = {
        contains: searchTerm,
      };
    }

    const options: any = {
      skip: (page - 1) * pageSize,
      take: pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    };

    const searchParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      key === "filter"
        ? searchParams.set("filter", JSON.stringify(value))
        : searchParams.set(key, typeof value === "string" ? value : `${value}`);
    });

    const res = await api(
      {
        ...apiRoutes.tags.list,
        url: apiRoutes.tags.list.url(searchParams),
      },
      undefined,
      true,
    );

    const data = await res.json();
    if (isAppError(data)) {
      // we should display the error to the UI, not throwing it
      throw data;
    } else {
      const successResult = data as TagListOutputSchema;
      return {
        items: successResult.items.map((item) => ({
          ...item,
          label: item.value,
        })),
        totalItemsCount: successResult.itemsCount,
      };
    }
  };

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
      <EntityRelation
        queryFn={queryFn}
        entityName="tag"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(tag) => {
          onSelectingTag(tag);
          setOpen(false);
        }}
        selectedIds={[tags.find((t) => t.id === currentTag)?.id ?? ""]}
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
