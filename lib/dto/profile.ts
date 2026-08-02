import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
} from "./common";
import { languageCodeSchema } from "./language-code";

const profileTranslationSchema = baseTranslationEntity.extend({
  displayName: z.string(),
  summary: z.string(),
});

const profileAssetSchema = entityAssetSchema.extend({
  profileId: z.string(),
});

export type ProfileAsset = z.infer<typeof profileAssetSchema>;

export const profile = baseSchema.extend({
  displayName: z.string(),
  summary: z.string(),
  username: z.string(),
  languageCode: languageCodeSchema,
  translations: z.array(profileTranslationSchema),
  assets: z.array(profileAssetSchema),
  featuredAsset: asset.nullish(),
});

export type Profile = z.infer<typeof profile>;

const profileTranslationInputSchema = baseTranslationEntityInput.extend({
  displayName: z.string().nonempty(),
  summary: z.string().nonempty(),
});

// ######################## Update ############################

export const updateProfileInputSchema = z.object({
  id: z.string(),
  assetIds: z.array(z.string()),
  featuredAssetId: z.string().optional(),
  translations: z.array(profileTranslationInputSchema).nonempty(),
});

export type UpdateProfileInputSchema = z.infer<typeof updateProfileInputSchema>;

// ###################### ClientSafe #####################
export const clientSafeSchema = z.object({
  id: z.string(),
  summary: z.string(),
  displayName: z.string(),
  languageCode: languageCodeSchema,
  username: z.string(),
  assets: z.array(profileAssetSchema).optional(),
  featuredAsset: asset.nullable().optional(),
  translations: z.array(profileTranslationSchema),
});

export type ClientSafeProfile = z.infer<typeof clientSafeSchema>;
