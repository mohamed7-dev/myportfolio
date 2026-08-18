"use client";
import { CloudIcon, Loader2Icon } from "lucide-react";
import React from "react";
import {
  type FileError,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { sharedConfig } from "@/lib/config/shared-config";
import { handleDropZoneRejections } from "@/lib/helpers/dropzone";
import { cn } from "@/lib/utils";
import { normalizeFileTypes } from "@/lib/utils/normalize-file-types";
import { validateMimeType } from "@/lib/utils/validate-mimetype";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export type UploadingInfo = {
  file: File | null;
  error: string[];
};

export type UploadDropZoneProps = {
  assetType: "source" | "preview";
  className?: React.ComponentProps<"div">["className"];
  onFileSelected?: (file: File) => void;
  onRejected?: (errors: string[]) => void;
  progress: number;
  isPending: boolean;
};

export function UploadDropZone({
  className,
  assetType,
  onFileSelected,
  onRejected,
  progress,
  isPending,
}: UploadDropZoneProps) {
  const [uploadingInfo, setUploadingInfo] = React.useState<UploadingInfo>({
    file: null,
    error: [],
  });

  const assetConfig =
    assetType === "source"
      ? sharedConfig.asset.sourceFileTypes
      : sharedConfig.asset.previewFileTypes;

  const allowedExtensions = Object.values(assetConfig).flatMap(
    (item) => item.extensions,
  );

  const onDropRejectedCb = React.useCallback(
    (rejectedFiles: FileRejection[]) => {
      const errors = handleDropZoneRejections(rejectedFiles);
      setUploadingInfo({
        file: null,
        error: errors,
      });

      onRejected?.(errors);
    },
    [onRejected],
  );

  const onDropAcceptedCb = React.useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) {
        return;
      }
      setUploadingInfo({
        file,
        error: [],
      });

      onFileSelected?.(file);
    },
    [onFileSelected],
  );

  const validateDropzoneFile = React.useCallback(
    (file: File): FileError | FileError[] | null => {
      const errors: FileError[] = [];

      const mimeTypes = normalizeFileTypes(allowedExtensions);

      if (!validateMimeType(file.type, mimeTypes)) {
        errors.push({
          code: "file-invalid-type",
          message: `Only files with these extensions (${allowedExtensions.join(", ")}) are allowed.`,
        });
      }

      const normalizedMimeType = mimeTypes.find(
        (m) => m.type === file.type.split("/")[0],
      );
      const maxSizeForFileType = assetConfig[`${normalizedMimeType?.type}/*`]
        ? assetConfig[`${normalizedMimeType?.type}/*`].maxSizeInMb
        : undefined;

      if (!maxSizeForFileType || file.size > maxSizeForFileType * 1024 * 1024) {
        errors.push({
          code: "file-too-large",
          message: `File size must be less than or equal to ${
            maxSizeForFileType ?? "the configured"
          } MB.`,
        });
      }

      return errors.length > 0 ? errors : null;
    },
    [assetConfig, allowedExtensions],
  );

  const { getInputProps, getRootProps, isDragActive, inputRef } = useDropzone({
    multiple: false,
    maxFiles: 1,
    accept: Object.fromEntries(
      Object.entries(assetConfig).map(([key, value]) => [
        key,
        value.extensions,
      ]),
    ),
    onDropAccepted: onDropAcceptedCb,
    onDropRejected: onDropRejectedCb,
    validator: validateDropzoneFile,
  });

  React.useEffect(() => {
    if (!isPending) {
      setUploadingInfo({ file: null, error: [] });
      if (inputRef.current?.files) {
        inputRef.current.files = null;
      }
    }
  }, [isPending, inputRef]);

  return (
    <div
      className={cn(
        "w-full border-2 border-border rounded-base p-2 bg-background flex flex-col gap-2 items-center",
        isDragActive && "border-primary",
        className,
      )}
    >
      {uploadingInfo.file && !isPending && (
        <Alert>
          <AlertTitle>File Accepted</AlertTitle>
          <AlertDescription>
            File name: {uploadingInfo.file.name}
          </AlertDescription>
        </Alert>
      )}
      {!!uploadingInfo.error.length && !isPending && (
        <Alert variant={"destructive"}>
          <AlertTitle>File Rejection</AlertTitle>
          <AlertDescription>
            <ul className="w-full">
              {uploadingInfo.error.map((err) => (
                <li className="w-full" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {isPending && (
        <div className="flex items-center justify-center gap-2">
          <Loader2Icon className="animate-spin size-10 stroke-primary" />
          <p className="text-md">Uploading...</p>
          <p className="text-md">{progress}%</p>
        </div>
      )}

      {!isPending && (
        <div
          className={cn(
            "size-full flex cursor-pointer items-center justify-center",
          )}
          {...getRootProps()}
        >
          <CloudIcon className="size-20 stroke-primary" />
          <input className="size-full cursor-pointer" {...getInputProps()} />
        </div>
      )}
      {!isPending && (
        <p className="flex flex-col gap-2 items-center text-center">
          <span>Drag/Drop or select file.</span>
          <span>
            Only files with these extensions{" "}
            <strong className="text-foreground font-semibold">
              ({allowedExtensions.join(", ")})
            </strong>{" "}
            are allowed
          </span>
        </p>
      )}
    </div>
  );
}
