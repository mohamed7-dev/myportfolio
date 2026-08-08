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
  intro: z.string(),
  subHeading: z.string(),
  subtitle: z.string(),
  jobTitle: z.string(),
  location: z.string(),
  currentFocus: z.string(),
});

const profileAssetSchema = entityAssetSchema.extend({
  profileId: z.string(),
});

export type ProfileAsset = z.infer<typeof profileAssetSchema>;

export const profile = baseSchema.extend({
  displayName: z.string(),
  summary: z.string(),
  username: z.string(),
  handle: z.string(),
  intro: z.string(),
  subHeading: z.string(),
  subtitle: z.string(),
  jobTitle: z.string(),
  location: z.string(),
  currentFocus: z.string(),
  projectsShipped: z.number(),
  openSourceContributions: z.number(),
  yearsOfExperience: z.number(),
  languageCode: languageCodeSchema,
  translations: z.array(profileTranslationSchema),
  assets: z.array(profileAssetSchema),
  featuredAsset: asset.nullish(),
});

export type Profile = z.infer<typeof profile>;

const profileTranslationInputSchema = baseTranslationEntityInput.extend({
  displayName: z.string(),
  summary: z.string(),
  intro: z.string(),
  subHeading: z.string(),
  subtitle: z.string(),
  jobTitle: z.string(),
  location: z.string(),
  currentFocus: z.string(),
});

// ######################## Update ############################

export const updateProfileInputSchema = z.object({
  id: z.string(),
  handle: z.string().optional(),
  projectsShipped: z.coerce.number().optional(),
  openSourceContributions: z.coerce.number().optional(),
  yearsOfExperience: z.coerce.number().optional(),
  assetIds: z.array(z.string()),
  featuredAssetId: z.string().optional(),
  translations: z
    .array(
      profileTranslationInputSchema
        .partial()
        .extend({ languageCode: languageCodeSchema }),
    )
    .optional(),
});

export type UpdateProfileInputSchema = z.infer<typeof updateProfileInputSchema>;

// ###################### ClientSafe #####################
export const clientSafeSchema = z.object({
  id: z.string(),
  handle: z.string(),
  projectsShipped: z.number(),
  openSourceContributions: z.number(),
  yearsOfExperience: z.number(),
  summary: z.string(),
  intro: z.string(),
  subHeading: z.string(),
  subtitle: z.string(),
  jobTitle: z.string(),
  location: z.string(),
  currentFocus: z.string(),
  displayName: z.string(),
  languageCode: languageCodeSchema,
  username: z.string(),
  assets: z.array(profileAssetSchema).optional(),
  featuredAsset: asset.nullable().optional(),
  translations: z.array(profileTranslationSchema),
});

export type ClientSafeProfile = z.infer<typeof clientSafeSchema>;
