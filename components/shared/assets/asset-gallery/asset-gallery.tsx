"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import type { ClientUploadedFileData } from "uploadthing/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StyledUploadDropzone } from "@/components/ut-components";
import type {
  Asset as AssetEntity,
  AssetListOutputSchema,
  CreateAssetInputSchema,
  CreateAssetOutputSchema,
} from "@/lib/dto/asset";
import { AssetBulkActions } from "../asset-bulk-actions";
import { DeleteAssetsBulkAction } from "../delete-assets-bulk-action";
import { ActionsBar, AssetType, type AssetTypeUnion } from "./actions-bar";
import { AssetPreviewUploadDialog } from "./asset-preview-upload-dialog";
import { AssetGridView } from "./assets-grid-view";
import { AssetsPagination } from "./assets-pagination";

export type Asset = AssetEntity;

interface AssetGalleryProps {
  multiSelect?: "manual" | "auto";
  pageSize?: number;
  displayBulkActions?: boolean;
  onSelectAsset?: (assets: Asset[]) => void;
  initialSelectedAssets?: Asset[];
}

export function AssetGallery({
  multiSelect = undefined,
  pageSize = 24,
  onSelectAsset,
  displayBulkActions = true,
  initialSelectedAssets = [],
}: AssetGalleryProps) {
  const qClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [openAssetPreviewDialog, setOpenAssetPreviewDialog] =
    React.useState(false);
  const previewFileInfo = React.useRef<ClientUploadedFileData<any> | undefined>(
    undefined,
  );
  const [assetType, setAssetType] = React.useState<AssetTypeUnion>(
    AssetType.ALL,
  );
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedAssets, setSelectedAssets] = React.useState<Asset[]>(
    initialSelectedAssets || [],
  );
  const [page, setPage] = React.useState(1);

  const queryKey = [
    "asset-gallery",
    assetType,
    debouncedSearch,
    page,
    pageSize,
  ];

  const { mutate } = useMutation({
    mutationFn: async (input: CreateAssetInputSchema) => {
      const res = await fetch(`/api/assets`, {
        method: "post",
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as CreateAssetOutputSchema;
      return data;
    },
    onSuccess: async () => {
      await qClient.invalidateQueries({ queryKey });
    },
  });

  const {
    data,
    isPending: isLoadingAssets,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (debouncedSearch) {
        filter.name = {
          contains: debouncedSearch,
        };
      }

      if (assetType !== AssetType.ALL) {
        filter.type = {
          equals: assetType,
        };
      }

      const options: any = {
        skip: (page - 1) * pageSize,
        take: pageSize,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
      };
      const searchParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          searchParams.set(
            key,
            typeof value === "object"
              ? JSON.stringify(value)
              : (value as string),
          );
        }
      });
      const res = await fetch(`/api/assets?${searchParams.toString()}`, {
        method: "get",
        credentials: "include",
      });
      const data = (await res.json()) as AssetListOutputSchema;
      return data;
    },
  });

  const assets = (data?.items ?? []) as Asset[];
  const totalItemsCount = data?.itemsCount || 0;
  const totalPagesCount = Math.ceil(totalItemsCount / pageSize);

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

  // Pagination
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesCount) return;
    setPage(newPage);
  };

  const onPageSizeChange = (pageSize: number) => {
    router.push(`${pathname}?pageSize=${pageSize}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <ActionsBar
        searchInput={searchInput}
        onSearchInputChange={(value) => setSearchInput(value)}
        assetType={assetType}
        onAssetTypeChange={(value) => setAssetType(value)}
      />
      {displayBulkActions && !!selectedAssets.length && (
        <AssetBulkActions
          selection={selectedAssets}
          bulkActions={[{ component: DeleteAssetsBulkAction }]}
          refetch={refetch}
        />
      )}
      <StyledUploadDropzone
        endpoint="assetUploader"
        onChange={(acceptedFiles) => {
          if (acceptedFiles.length) {
            setOpenAssetPreviewDialog(true);
          }
        }}
        onClientUploadComplete={(res) => {
          const file = res[0];
          if (file && previewFileInfo.current) {
            mutate({
              sourceIdentifier: file.ufsUrl,
              previewIdentifier: previewFileInfo.current.ufsUrl,
              sourceFileMimetype: file.type,
              sourceFileSize: file.size,
              sourceFileKey: file.key,
              previewFileKey: previewFileInfo.current.key,
              sourceFilename: file.name,
            });
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <AssetGridView
        assets={assets ?? []}
        isLoading={isLoadingAssets}
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
        {/* Items per page selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Items per page
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                if (value == null) return;
                const newPageSize = Number.parseInt(value, 10);
                onPageSizeChange(newPageSize);
                setPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[1, 12, 24, 48, 96].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {totalPagesCount > 1 && (
          <AssetsPagination
            page={page}
            goToPage={goToPage}
            totalPagesCount={totalPagesCount}
          />
        )}
      </div>
      <AssetPreviewUploadDialog
        open={openAssetPreviewDialog}
        onClose={() => setOpenAssetPreviewDialog(false)}
        onUploadComplete={(info) => {
          previewFileInfo.current = info;
          setOpenAssetPreviewDialog(false);
          toast.success("Preview file was uploaded successfully");
        }}
      />
    </div>
  );
}
