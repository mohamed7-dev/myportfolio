import { z } from "@/lib/helpers/zod";
import { objectStorageResourceTypeSchema } from "./asset-upload";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  deletionResponseSchema,
  entityNotFoundErrorSchema,
  forbiddenErrorSchema,
  inputIdsSchema,
  internalServerErrorSchema,
  numericFilterOperators,
  sortDirection,
  stringFilterOperators,
  unAuthorizedErrorSchema,
} from "./common";
import { languageCodeSchema } from "./language-code";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";
import { tag } from "./tag";

const assetTranslationSchema = baseTranslationEntity.extend({
  name: z.string(),
});

export const asset = baseSchema.extend({
  name: z.string(),
  languageCode: languageCodeSchema,
  mimetype: z.string(),
  type: objectStorageResourceTypeSchema,
  width: z.number(),
  height: z.number(),
  fileSize: z.number(),
  sourceIdentifier: z.string(),
  previewIdentifier: z.string(),
  tags: z.array(tag).optional(),
  translations: z.array(assetTranslationSchema),
});

export type Asset = z.infer<typeof asset>;

// ################## Create ####################

// Note: CreateAsset is not part of the api dto, it's now a step in the upload session
const assetTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string(),
});

export const createAssetInputSchema = z.object({
  sourceIdentifier: z.string(),
  previewIdentifier: z.string(),
  sourceFilename: z.string(),
  sourceFileMimetype: z.string(),
  sourceFileSize: z.number(),
  height: z.number().optional(),
  width: z.number().optional(),
  tags: z.array(z.string()).optional(),
  translations: z.array(assetTranslationInputSchema).optional(),
});

export type CreateAssetInputSchema = z.infer<typeof createAssetInputSchema>;

export const createAssetOutputSchema = asset;

export type CreateAssetOutputSchema = z.infer<typeof createAssetOutputSchema>;

// ################## Update ####################

export const updateAssetInputSchema = z.object({
  id: z.string().nonempty(),
  tags: z.array(z.string()).optional(),
  translations: z.array(assetTranslationInputSchema).optional(),
});
export type UpdateAssetInputSchema = z.infer<typeof updateAssetInputSchema>;

export const updateAssetOutputSchema = z.union([
  asset,
  unAuthorizedErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  entityNotFoundErrorSchema,
]);

export type UpdateAssetOutputSchema = z.infer<typeof updateAssetOutputSchema>;

// ################## Delete ####################

export const deleteAssetsInputSchema = inputIdsSchema;

export type DeleteAssetsInputSchema = z.infer<typeof deleteAssetsInputSchema>;

export const deleteAssetsOutputSchema = z.union([
  z.array(deletionResponseSchema),
  entityNotFoundErrorSchema,
  unAuthorizedErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
]);

export type DeleteAssetsOutputSchema = z.infer<typeof deleteAssetsOutputSchema>;

// ################## List ####################

export const assetListOutputSchema = createPaginatedListOutputSchema(asset);
export type AssetListOutputSchema = z.infer<typeof assetListOutputSchema>;

export const assetListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      type: stringFilterOperators,
      mimetype: stringFilterOperators,
      width: numericFilterOperators,
      height: numericFilterOperators,
      fileSize: numericFilterOperators,
      sourceIdentifier: stringFilterOperators,
      previewIdentifier: stringFilterOperators,
    })
    .partial(),
  z
    .object({
      name: sortDirection,
      type: sortDirection,
      mimetype: sortDirection,
      width: sortDirection,
      height: sortDirection,
      fileSize: sortDirection,
      sourceIdentifier: sortDirection,
      previewIdentifier: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
    })
    .partial(),
)
  .unwrap()
  .extend({
    tag: z.string().optional(),
  })
  .partial();

export type AssetListInputSchema = z.infer<typeof assetListInputSchema>;

//############################ Entity Asset ##########################
export const entityAssetSchema = baseSchema.extend({
  position: z.number(),
  asset: asset,
});

export type EntityAsset = z.infer<typeof entityAssetSchema>;

//############################ Entity Asset ##########################
export const downloadAssetInputSchema = z.object({
  assetId: z.string(),
});

export type DownloadAssetInputSchema = z.infer<typeof downloadAssetInputSchema>;

export const downloadAssetOutputSchema = z.union([
  z.object({
    downloadUrl: z.string(),
  }),
  apiErrorSchema,
]);

export type DownloadAssetOutputSchema = z.infer<
  typeof downloadAssetOutputSchema
>;
