import { z } from "@/lib/helpers/zod";
import { deletionResponseSchema } from "./common";
import { languageCodeSchema } from "./language-code";
import { createPaginatedListOutputSchema } from "./paginated-list";

const assetTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const asset = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  languageCode: languageCodeSchema,
  mimetype: z.string(),
  width: z.number(),
  height: z.number(),
  fileSize: z.number(),
  fileKey: z.string(),
  sourceIdentifier: z.string(),
  tags: z.array(z.any()).optional(), // TODO: change to tag schema
  translations: z.array(assetTranslationSchema),
});

export type Asset = z.infer<typeof asset>;

// ################## Create ####################
const assetTranslationInputSchema = z.object({
  name: z.string(),
  languageCode: languageCodeSchema,
});

export const createAssetInputSchema = z.object({
  sourceIdentifier: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  key: z.string(),
  size: z.number(),
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

// ################## Delete ####################

export const deleteAssetsInputSchema = z.object({
  input: z.object({
    ids: z.array(z.string()),
  }),
});

export type DeleteAssetsInputSchema = z.infer<typeof deleteAssetsInputSchema>;

export const deleteAssetsOutputSchema = z.array(deletionResponseSchema);

export type DeleteAssetsOutputSchema = z.infer<typeof deleteAssetsOutputSchema>;
