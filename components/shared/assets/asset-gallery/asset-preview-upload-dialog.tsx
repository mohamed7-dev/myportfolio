import { toast } from "sonner";
import type { ClientUploadedFileData } from "uploadthing/types";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { StyledUploadDropzone } from "@/components/ut-components";

interface AssetPreviewUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (info: ClientUploadedFileData<any>) => void;
}

export function AssetPreviewUploadDialog({
  open,
  onClose,
  onUploadComplete,
}: AssetPreviewUploadDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <StyledUploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const file = res[0];
            onUploadComplete(file);
          }}
          onUploadError={(e) => {
            toast.error(`Preview file upload failure: {${e.message}}`);
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
