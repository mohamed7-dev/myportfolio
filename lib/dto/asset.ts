import { z } from "@/lib/helpers/zod";
import { objectStorageResourceTypeSchema } from "./asset-upload";
import {
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  deletionResponseSchema,
  inputIdsSchema,
} from "./common";
import { languageCodeSchema } from "./language-code";
import {
  createPaginatedListOutputSchema,
  paginatedListInputSchema,
} from "./paginated-list";

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
  tags: z.array(z.any()).nullish(), // TODO: change to tag schema
  translations: z.array(assetTranslationSchema),
});

export type Asset = z.infer<typeof asset>;

// ################## Create ####################
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

export const updateAssetOutputSchema = asset;

export type UpdateAssetOutputSchema = z.infer<typeof updateAssetOutputSchema>;

// ################## List ####################

export const assetListOutputSchema = createPaginatedListOutputSchema(asset);
export type AssetListOutputSchema = z.infer<typeof assetListOutputSchema>;

export const assetListInputSchema = paginatedListInputSchema.extend({
  filter: z
    .object({
      name: z.object({ contains: z.string() }).optional(),
      type: z.object({ equals: objectStorageResourceTypeSchema }).optional(),
    })
    .optional(),
});
export type AssetListInputSchema = z.infer<typeof assetListInputSchema>;

// ################## Delete ####################

export const deleteAssetsInputSchema = inputIdsSchema;

export type DeleteAssetsInputSchema = z.infer<typeof deleteAssetsInputSchema>;

export const deleteAssetsOutputSchema = z.array(deletionResponseSchema);

export type DeleteAssetsOutputSchema = z.infer<typeof deleteAssetsOutputSchema>;

//############################ Entity Asset ##########################
export const entityAssetSchema = baseSchema.extend({
  position: z.number(),
  asset: asset,
});

export type EntityAsset = z.infer<typeof entityAssetSchema>;
