"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useRouterUtils } from "@/hooks/use-router-utils";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type {
  Asset as AssetEntity,
  AssetListOutputSchema,
} from "@/lib/dto/asset";
import type { Tag } from "@/lib/dto/tag";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";
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
  initialAssets?: Asset[];
  initialItemsCount?: number;
  multiSelect?: "manual" | "auto";
  displayBulkActions?: boolean;
  onSelectAsset?: (assets: Asset[]) => void;
  initialSelectedAssets?: Asset[];
}

export function AssetGallery({
  initialAssets,
  initialItemsCount,
  multiSelect = undefined,
  onSelectAsset,
  displayBulkActions = true,
  initialSelectedAssets = [],
}: AssetGalleryProps) {
  const shouldFetchInternally = !initialAssets;
  const router = useRouter();
  const [source, setSource] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<File | null>(null);
  const [sourceProgress, setSourceProgress] = React.useState(0);
  const [previewProgress, setPreviewProgress] = React.useState(0);
  const { searchParams, updateSearchParams } = useRouterUtils();
  const qClient = useQueryClient();

  // External States
  const pageSizeString = searchParams.get("pageSize");
  const pageSize = pageSizeString ? Number(pageSizeString) : 24;
  const pageString = searchParams.get("page");
  const page = pageString ? Number(pageString) : 1;
  const assetTypeString = searchParams.get("type");
  const assetType = (
    assetTypeString ? assetTypeString : AssetType.all
  ) as AssetTypeUnion;
  const tag = searchParams.get("tag");

  // Internal States
  const [_tag, setTag] = React.useState("");
  const [_page, setPage] = React.useState(1);
  const [_pageSize, setPageSize] = React.useState(24);
  const [_assetType, setAssetType] = React.useState<AssetTypeUnion>(
    AssetType.all,
  );
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedAssets, setSelectedAssets] = React.useState<Asset[]>(
    initialSelectedAssets || [],
  );

  const queryKey = [
    "asset-gallery",
    _assetType,
    debouncedSearch,
    _page,
    _pageSize,
    _tag,
  ];

  const {
    data,
    isLoading: isLoadingAssets,
    refetch,
  } = useQuery({
    enabled: shouldFetchInternally,
    queryKey,
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (debouncedSearch) {
        filter.name = {
          contains: debouncedSearch,
        };
      }

      if (_assetType !== AssetType.all) {
        filter.type = {
          equals: _assetType,
        };
      }

      const options: any = {
        skip: (_page - 1) * _pageSize,
        take: _pageSize,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
      };

      if (_tag && _tag.length > 0) {
        options.tag = _tag;
      }

      const searchParams = new URLSearchParams();

      Object.entries(options).forEach(([key, value]) => {
        key === "filter"
          ? searchParams.set("filter", JSON.stringify(value))
          : searchParams.set(
              key,
              typeof value === "string" ? value : `${value}`,
            );
      });

      const res = await api(
        {
          ...apiRoutes.assets.list,
          url: apiRoutes.assets.list.url(searchParams),
        },
        undefined,
        true,
      );

      const data = await res.json();
      if (isAppError(data)) {
        // we should display the error to the UI, not throwing it
        throw data;
      } else {
        return data as AssetListOutputSchema;
      }
    },
  });

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
      if (shouldFetchInternally) {
        qClient.invalidateQueries({
          queryKey,
        });
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setSource(null);
      setPreview(null);
    },
  });

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

  const handleSelectingTag = (tag: string) => {
    if (shouldFetchInternally) {
      tag === currentTag ? setTag("") : setTag(tag);
    } else {
      tag === currentTag
        ? updateSearchParams({ tag: null })
        : updateSearchParams({ tag: tag });
    }
  };

  const resetPage = () => {
    if (shouldFetchInternally) {
      setPage(1);
    } else {
      updateSearchParams({ page: `${1}` });
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    if (shouldFetchInternally) {
      setPageSize(pageSize);
    } else {
      updateSearchParams({ pageSize: `${pageSize}` });
    }
  };

  const goToPage = (page: number) => {
    if (shouldFetchInternally) {
      setPage(page);
    } else {
      updateSearchParams({ page: `${page}` });
    }
  };

  const onAssetTypeChange = (assetType: AssetTypeUnion) => {
    if (shouldFetchInternally) {
      setAssetType(assetType);
    } else {
      if (assetType === AssetType.all) {
        updateSearchParams({ type: null });
      } else {
        updateSearchParams({ type: assetType });
      }
    }
  };

  const onSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleRefetching = () => {
    if (shouldFetchInternally) {
      refetch();
    } else {
      router.refresh();
    }
  };

  React.useEffect(() => {
    if (source && preview) {
      mutate({ source, preview });
    }
  }, [source, preview, mutate]);

  React.useEffect(() => {
    if (debouncedSearch && !shouldFetchInternally) {
      updateSearchParams({ searchQuery: debouncedSearch });
    }
  }, [debouncedSearch, updateSearchParams, shouldFetchInternally]);

  const assets = shouldFetchInternally ? data?.items : initialAssets;

  const tags = filterUnique(
    assets?.flatMap((asset) => asset.tags).filter(notNullOrUndefined) ?? [],
  );

  const tagsMap: Record<string, Tag> = {};

  if (assets) {
    for (const tag of tags) {
      tagsMap[tag.id] = tag;
    }
  }

  const uniqueTags = Object.values(tagsMap);

  const currentTag = shouldFetchInternally ? _tag : tag;
  const currentAssetType = shouldFetchInternally ? _assetType : assetType;
  const currentPageSize = shouldFetchInternally ? _pageSize : pageSize;
  const currentPage = shouldFetchInternally ? _page : page;
  const totalItemsCount =
    (shouldFetchInternally ? data?.itemsCount : initialItemsCount) || 0;
  const totalPagesCount = Math.ceil(totalItemsCount / Number(currentPageSize));

  return (
    <div className="flex flex-col gap-4">
      <ActionsBar
        tags={uniqueTags}
        currentTag={currentTag ?? undefined}
        onSelectingTag={handleSelectingTag}
        searchInput={searchInput}
        onSearchInputChange={onSearchInputChange}
        assetType={currentAssetType}
        onAssetTypeChange={onAssetTypeChange}
      />
      {displayBulkActions && !!selectedAssets.length && (
        <AssetBulkActions
          selection={selectedAssets}
          bulkActions={[{ component: DeleteAssetsBulkAction }]}
          refetch={handleRefetching}
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
        isLoading={shouldFetchInternally ? isLoadingAssets : false}
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
          pageSize={currentPageSize}
          totalPagesCount={totalPagesCount}
          page={currentPage}
          goToPage={goToPage}
          onPageSizeChange={onPageSizeChange}
          resetPage={resetPage}
        />
      </div>
    </div>
  );
}
