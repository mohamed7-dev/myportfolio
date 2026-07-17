"use client";
import {
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PaperclipIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/dto/asset";
import AssetPickerDialog from "../assets/asset-picker-dialog";
import { AssetList } from "./asset-list";
import { FeaturedAsset } from "./featured-asset";

export interface EntityAssetValue {
  assetIds?: string[] | null;
  featuredAssetId?: string | null;
}

interface EntityAssetsProps {
  compact?: boolean;
  updatePermissions?: boolean;
  enableMultiSelection?: boolean;
  assets?: Asset[];
  featuredAsset?: Asset | null;
  value?: EntityAssetValue;
  onBlur?: () => void;
  onChange?: (change: EntityAssetValue) => void;
}

export function EntityAssets(props: EntityAssetsProps) {
  const {
    updatePermissions = true,
    compact = false,
    value,
    onChange,
    onBlur,
    assets: initialAssets = [],
    featuredAsset: initialFeaturedAsset,
    enableMultiSelection = true,
  } = props;
  const [assets, setAssets] = React.useState<Asset[]>([...initialAssets]);
  const [featuredAsset, setFeaturedAsset] = React.useState<
    Asset | undefined | null
  >(initialFeaturedAsset);
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSelectAssets = React.useCallback(() => {
    setIsAssetPickerOpen(true);
  }, []);

  const emitChange = React.useCallback(
    (newAssets: Asset[], newFeaturedAsset: Asset | undefined | null) => {
      onChange?.({
        assetIds: newAssets.map((a) => a.id),
        featuredAssetId: newFeaturedAsset?.id ?? undefined,
      });
    },
    [onChange],
  );

  const handleAssetsPicked = React.useCallback(
    (selectedAssets: Asset[]) => {
      if (selectedAssets.length) {
        // Remove duplicates
        const uniqueAssets = enableMultiSelection
          ? [
              ...new Map(
                [...assets, ...selectedAssets].map((item) => [item.id, item]),
              ).values(),
            ]
          : selectedAssets;

        const newFeaturedAsset =
          !featuredAsset || !enableMultiSelection
            ? selectedAssets[0]
            : featuredAsset;

        setAssets(uniqueAssets);
        setFeaturedAsset(newFeaturedAsset);
        emitChange(uniqueAssets, newFeaturedAsset);
      }
      setIsAssetPickerOpen(false);
    },
    [assets, featuredAsset, enableMultiSelection, emitChange],
  );

  const isFeatured = React.useCallback(
    (asset: Asset) => {
      return !!featuredAsset && featuredAsset.id === asset.id;
    },
    [featuredAsset],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setAssets((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          const newAssets = arrayMove(items, oldIndex, newIndex);
          emitChange(newAssets, featuredAsset);
          return newAssets;
        });
      }
    },
    [emitChange, featuredAsset],
  );

  const handleRemoveAsset = React.useCallback(
    (asset: Asset) => {
      const newAssets = assets.filter((a) => a.id !== asset.id);
      let newFeaturedAsset = featuredAsset;

      if (featuredAsset && featuredAsset.id === asset.id) {
        newFeaturedAsset = newAssets.length > 0 ? newAssets[0] : undefined;
      }

      setAssets(newAssets);
      setFeaturedAsset(newFeaturedAsset);
      emitChange(newAssets, newFeaturedAsset);
    },
    [assets, featuredAsset, emitChange],
  );

  const handleSetAsFeatured = React.useCallback(
    (asset: Asset) => {
      setFeaturedAsset(asset);
      emitChange(assets, asset);
    },
    [assets, emitChange],
  );

  // Update internal state when props change
  React.useEffect(() => {
    if (initialAssets.length) {
      setAssets([...initialAssets]);
    }
  }, [initialAssets]);

  React.useEffect(() => {
    setFeaturedAsset(initialFeaturedAsset);
  }, [initialFeaturedAsset]);

  const AddAssetButton = () =>
    updatePermissions && (
      <Button
        variant="neutralNoShadow"
        size={compact ? "sm" : "default"}
        className={compact ? "w-full" : ""}
        onClick={handleSelectAssets}
      >
        <PaperclipIcon className="mr-2 h-4 w-4" />
        Add asset
      </Button>
    );

  return (
    <React.Fragment>
      {compact ? (
        <div className="flex flex-col gap-3">
          <FeaturedAsset
            featuredAsset={featuredAsset}
            compact={compact}
            onSelectAssets={handleSelectAssets}
            onPreviewAsset={setPreviewAsset}
          />
          <AssetList
            assets={assets}
            compact={compact}
            sensors={sensors}
            updatePermissions={updatePermissions}
            isFeatured={isFeatured}
            onPreview={setPreviewAsset}
            onSetAsFeatured={handleSetAsFeatured}
            onRemove={handleRemoveAsset}
            onDragEnd={handleDragEnd}
          />
          <AddAssetButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4">
          <FeaturedAsset
            featuredAsset={featuredAsset}
            compact={compact}
            onSelectAssets={handleSelectAssets}
            onPreviewAsset={setPreviewAsset}
          />
          <div className="flex flex-col gap-4">
            <AssetList
              assets={assets}
              compact={compact}
              sensors={sensors}
              updatePermissions={updatePermissions}
              isFeatured={isFeatured}
              onPreview={setPreviewAsset}
              onSetAsFeatured={handleSetAsFeatured}
              onRemove={handleRemoveAsset}
              onDragEnd={handleDragEnd}
            />
            <AddAssetButton />
          </div>
        </div>
      )}

      {isAssetPickerOpen && (
        <AssetPickerDialog
          enableMultiSelection={enableMultiSelection}
          onSelect={handleAssetsPicked}
          onClose={() => setIsAssetPickerOpen(false)}
          open={isAssetPickerOpen}
        />
      )}
    </React.Fragment>
  );
}
