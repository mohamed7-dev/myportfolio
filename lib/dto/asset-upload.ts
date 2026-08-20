import { z } from "@/lib/helpers/zod";
import { ObjectStorageResourceType } from "../config/object-storage-strategy.interface";
import { apiErrorSchema } from "./common";

export enum AssetUploadStatus {
  PENDING = "pending",
  COMMITTED = "committed",
  ABORTED = "aborted",
}

export const assetUploadStatusSchema = z.nativeEnum(AssetUploadStatus);

export const objectStorageResourceTypeSchema = z.nativeEnum(
  ObjectStorageResourceType,
);

// ############################### Create ##################################

export const createAssetUploadInputSchema = z.object({
  source: z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
  preview: z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
});

export type CreateAssetUploadInputSchema = z.infer<
  typeof createAssetUploadInputSchema
>;

export const createAssetUploadOutputSchema = z.union([
  z.object({
    uploadId: z.string(),
    source: z.object({
      key: z.string(),
      upload: z.object({
        url: z.string(),
        method: z.union([z.literal("POST"), z.literal("PUT")]),
        headers: z.record(z.string(), z.string()).optional(),
        fields: z.record(z.string(), z.string()).optional(),
      }),
    }),
    preview: z.object({
      key: z.string(),
      upload: z.object({
        url: z.string(),
        method: z.union([z.literal("POST"), z.literal("PUT")]),
        headers: z.record(z.string(), z.string()).optional(),
        fields: z.record(z.string(), z.string()).optional(),
      }),
    }),
  }),
  apiErrorSchema,
]);

export type CreateAssetUploadOutputSchema = z.infer<
  typeof createAssetUploadOutputSchema
>;

// ############################### Abort ##################################

export const abortUploadSessionInputSchema = z.object({
  uploadSessionId: z.string(),
});

export type AbortUploadSessionInputSchema = z.infer<
  typeof abortUploadSessionInputSchema
>;

// ############################### Commit ##################################

export const commitUploadSessionInputSchema = z.object({
  uploadSessionId: z.string(),
});

export type CommitUploadSessionInputSchema = z.infer<
  typeof commitUploadSessionInputSchema
>;

export const commitUploadSessionOutputSchema = z.union([
  z.object({
    assetId: z.string(),
  }),
  apiErrorSchema,
]);

export type CommitUploadSessionOutputSchema = z.infer<
  typeof commitUploadSessionOutputSchema
>;
