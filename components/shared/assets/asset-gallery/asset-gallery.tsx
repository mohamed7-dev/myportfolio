"use client";
import { useMutation } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import React from "react";
import { toast } from "sonner";
import { useRouterUtils } from "@/hooks/use-router-utils";
import { useRouter } from "@/i18n/navigation";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { Asset as AssetEntity } from "@/lib/dto/asset";
import { AssetUploader } from "@/lib/upload/asset-uploader";
import { uploadFile } from "@/lib/upload/upload";
import { filterUnique } from "@/lib/utils/filter-unique";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import { PaginationBar } from "../../data-table/pagination-bar";
import { UploadDropZone } from "../../upload-drop-zone";
import { AssetBulkActions } from "../asset-bulk-actions";
import { DeleteAssetsBulkAction } from "../delete-assets-bulk-action";
import { ActionsBar } from "./actions-bar";
import { AssetGridView } from "./assets-grid-view";

export const AssetType = {
  ...ObjectStorageResourceType,
  all: "all",
} as const;

export type AssetTypeUnion = keyof typeof AssetType;

export type Asset = AssetEntity;

interface AssetGalleryProps {
  assets: Asset[];
  itemsCount: number;
  multiSelect?: "manual" | "auto";
  displayBulkActions?: boolean;
  onSelectAsset?: (assets: Asset[]) => void;
  initialSelectedAssets?: Asset[];
}

export function AssetGallery({
  assets,
  itemsCount,
  multiSelect = undefined,
  onSelectAsset,
  displayBulkActions = true,
  initialSelectedAssets = [],
}: AssetGalleryProps) {
  const router = useRouter();
  const [source, setSource] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<File | null>(null);
  const [sourceProgress, setSourceProgress] = React.useState(0);
  const [previewProgress, setPreviewProgress] = React.useState(0);

  const { searchParams, updateSearchParams } = useRouterUtils();
  const pageSizeString = searchParams.get("pageSize");
  const pageSize = pageSizeString ? Number(pageSizeString) : 24;
  const pageString = searchParams.get("page");
  const page = pageString ? Number(pageString) : 1;
  const assetTypeString = searchParams.get("type");
  const assetType = (
    assetTypeString ? assetTypeString : AssetType.all
  ) as AssetTypeUnion;
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedAssets, setSelectedAssets] = React.useState<Asset[]>(
    initialSelectedAssets || [],
  );

  const { mutate, isPending: isUploadingAsset } = useMutation({
    mutationFn: async (input: { source: File; preview: File }) => {
      const assetUploader = new AssetUploader();
      const ac = new AbortController();
      const data = await assetUploader.upload({
        source: { data: input.source, name: input.source.name },
        preview: { data: input.preview, name: input.preview.name },
        signal: ac.signal,
        onSourceProgress: (progress) => setSourceProgress(progress),
        onPreviewProgress: (progress) => setPreviewProgress(progress),
        uploadHandler: uploadFile,
      });
      return data;
    },
    onSuccess: async () => {
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setSource(null);
      setPreview(null);
    },
  });

  const totalItemsCount = itemsCount || 0;
  const totalPagesCount = Math.ceil(totalItemsCount / Number(pageSize));

  // Selection
  const isAssetSelected = (asset: Asset) =>
    selectedAssets.some((a) => a.id === asset.id);

  const toggleAssetSelection = React.useCallback(
    (asset: Asset) => {
      const isCurrentlySelected = selectedAssets.some((a) => a.id === asset.id);
      const newSelected = isCurrentlySelected
        ? selectedAssets.filter((a) => a.id !== asset.id)
        : [...selectedAssets, asset];
      setSelectedAssets(newSelected);
      onSelectAsset?.(newSelected);
    },
    [selectedAssets, onSelectAsset],
  );

  const handleSelect = (
    asset: Asset,
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (multiSelect === "auto") {
      toggleAssetSelection(asset);
      return;
    }

    // Manual mode - check for modifier key
    const isModifierKeyPressed = event.metaKey || event.ctrlKey;

    if (multiSelect === "manual" && isModifierKeyPressed) {
      toggleAssetSelection(asset);
    } else {
      // No modifier key - single select
      setSelectedAssets([asset]);
      onSelectAsset?.([asset]);
    }
  };

  React.useEffect(() => {
    if (source && preview) {
      mutate({ source, preview });
    }
  }, [source, preview, mutate]);

  React.useEffect(() => {
    if (debouncedSearch) {
      updateSearchParams({ searchQuery: debouncedSearch });
    }
  }, [debouncedSearch, updateSearchParams]);

  const tags = filterUnique(
    assets.flatMap((asset) => asset.tags).filter(notNullOrUndefined),
  );
  return (
    <div className="flex flex-col gap-4">
      <ActionsBar
        tags={tags}
        searchInput={searchInput}
        onSearchInputChange={(value) => setSearchInput(value)}
        assetType={assetType}
        onAssetTypeChange={(value) => {
          if (value === AssetType.all) {
            updateSearchParams({ type: null });
          } else {
            updateSearchParams({ type: value });
          }
        }}
      />
      {displayBulkActions && !!selectedAssets.length && (
        <AssetBulkActions
          selection={selectedAssets}
          bulkActions={[{ component: DeleteAssetsBulkAction }]}
          refetch={() => router.refresh()}
        />
      )}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-2">
          <h3 className="text-sm font-heading">Source File</h3>
          <UploadDropZone
            assetType="source"
            onFileSelected={(data) => {
              setSource(data);
            }}
            progress={sourceProgress}
            isPending={isUploadingAsset}
          />
        </section>
        <section className="space-y-2">
          <h3 className="text-sm font-heading">Preview File</h3>
          <UploadDropZone
            assetType="preview"
            onFileSelected={(data) => {
              setPreview(data);
            }}
            progress={previewProgress}
            isPending={isUploadingAsset}
          />
        </section>
      </article>

      <AssetGridView
        assets={assets ?? []}
        isLoading={false}
        isAssetSelected={isAssetSelected}
        toggleSelection={toggleAssetSelection}
        onAssetClick={handleSelect}
      />
      <div className="flex items-center">
        <div className="mt-2 text-sm text-foreground shrink-0">
          {totalItemsCount} {totalItemsCount === 1 ? "asset" : "assets"} found
          {" / "}
          {selectedAssets.length > 0 && (
            <span>{`${selectedAssets.length} selected`}</span>
          )}
        </div>
        <div className="flex-1"></div>
        <PaginationBar
          pageSize={pageSize}
          totalPagesCount={totalPagesCount}
          page={page}
          goToPage={(page) => updateSearchParams({ page: `${page}` })}
          onPageSizeChange={(pageSize) =>
            updateSearchParams({ pageSize: `${pageSize}` })
          }
          resetPage={() => updateSearchParams({ page: `${1}` })}
        />
      </div>
    </div>
  );
}
