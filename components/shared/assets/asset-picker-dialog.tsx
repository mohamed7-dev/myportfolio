import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Asset } from "@/lib/dto/asset";
import { AssetGallery } from "./asset-gallery/asset-gallery";

interface AssetPickerDialogProps {
  dialogTitle?: string;
  open: boolean;
  onClose: () => void;
  initialSelectedAssets?: Asset[];
  onSelect: (assets: Asset[]) => void;
  enableMultiSelection?: boolean;
}

export default function AssetPickerDialog(props: AssetPickerDialogProps) {
  const {
    dialogTitle = "Select Assets",
    open,
    onClose,
    initialSelectedAssets = [],
    onSelect,
    enableMultiSelection = false,
  } = props;

  const [selectedAssets, setSelectedAssets] = React.useState<Asset[]>(
    initialSelectedAssets,
  );

  const handleAssetSelect = (assets: Asset[]) => {
    setSelectedAssets(assets);
  };

  const handleConfirm = () => {
    onSelect(selectedAssets);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-200 lg:max-w-250 h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {enableMultiSelection
              ? dialogTitle
              : dialogTitle.replace("Assets", "Asset")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {enableMultiSelection
              ? "Browse and select one or more assets"
              : "Browse and select an asset"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-1">
          <AssetGallery
            onSelectAsset={handleAssetSelect}
            multiSelect="manual"
            initialSelectedAssets={initialSelectedAssets}
            displayBulkActions={false}
          />
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          <Button variant="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedAssets.length === 0}
          >
            {selectedAssets.length > 0 && enableMultiSelection
              ? `Select ${selectedAssets.length} Asset${selectedAssets.length > 1 ? "s" : ""}`
              : "Select Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
