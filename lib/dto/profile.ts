import { z } from "@/lib/helpers/zod";
import { asset } from "./asset";
import { languageCodeSchema } from "./language-code";

const profileTranslationSchema = z.object({
  languageCode: languageCodeSchema,
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  displayName: z.string(),
  summary: z.string(),
});

const profileAssetSchema = z.object({
  position: z.number(),
  asset: asset,
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ProfileAsset = z.infer<typeof profileAssetSchema>;

export const profile = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  displayName: z.string(),
  summary: z.string(),
  username: z.string(),
  languageCode: languageCodeSchema,
  translations: z.array(profileTranslationSchema),
  assets: z.array(profileAssetSchema),
});

export type Profile = z.infer<typeof profile>;

// ######################## Update ############################
const profileTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
  displayName: z.string().nonempty(),
  summary: z.string().nonempty(),
});

export const updateProfileInputSchema = z.object({
  id: z.string(),
  assetIds: z.array(z.string()),
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
  translations: z.array(profileTranslationSchema),
});

export type ClientSafeProfile = z.infer<typeof clientSafeSchema>;
