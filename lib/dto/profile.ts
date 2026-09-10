import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  idSchema,
  nullableOptionalIdInputSchema,
} from "./common";
import { languageCodeSchema } from "./language-code";

export enum ProfileAssetType {
  COVER = "COVER",
  PERSONAL = "PERSONAL",
}

const profileAssetTypeSchema = z.nativeEnum(ProfileAssetType);

const profileTranslationSchema = baseTranslationEntity.extend({
  displayName: z.string().min(1, { message: "Display name is required" }),
  summary: z.string().min(1, { message: "Summary is required" }),
  intro: z.string().min(1, { message: "Intro is required" }),
  subHeading: z.string().min(1, { message: "Subheading is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  currentFocus: z.string().min(1, { message: "Current focus is required" }),
});

const profileAssetSchema = entityAssetSchema.extend({
  profileId: idSchema,
  type: profileAssetTypeSchema,
});

export type ProfileAsset = z.infer<typeof profileAssetSchema>;

export const profile = baseSchema
  .extend(
    profileTranslationSchema.omit({
      createdAt: true,
      updatedAt: true,
      id: true,
    }).shape,
  )
  .extend({
    username: z.string().min(1, { message: "Username can't be empty" }),
    handle: z.string().min(1, { message: "Handle is required" }),
    cvAssetId: idSchema.nullable(),
    projectsShipped: z.coerce.number().nonnegative(),
    openSourceContributions: z.coerce.number().nonnegative(),
    yearsOfExperience: z.coerce.number().nonnegative(),
    translations: z.array(profileTranslationSchema),
    assets: z.array(profileAssetSchema).nullable(),
    featuredAsset: asset.nullable(),
  });

export type Profile = z.infer<typeof profile>;

const profileTranslationInputSchema = profileTranslationSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

// ###################### ClientSafe #####################
export const clientSafeSchema = profile;

export type ClientSafeProfile = z.infer<typeof clientSafeSchema>;

// ######################## Update ############################

export const updateProfileInputSchema = profile
  .pick({
    handle: true,
    projectsShipped: true,
    openSourceContributions: true,
    yearsOfExperience: true,
  })
  .partial()
  .extend({
    id: idSchema,
    cvAssetId: nullableOptionalIdInputSchema,
    assetIds: z
      .array(z.object({ id: idSchema, type: profileAssetTypeSchema }))
      .optional(),
    featuredAssetId: idSchema.optional(),
    translations: z
      .array(
        profileTranslationInputSchema
          .partial()
          .extend({ languageCode: languageCodeSchema }),
      )
      .optional(),
  });

export type UpdateProfileInputSchema = z.infer<typeof updateProfileInputSchema>;

export const updateProfileOutputSchema = z.union([
  clientSafeSchema,
  apiErrorSchema,
]);
export type UpdateProfileOutputSchema = z.infer<
  typeof updateProfileOutputSchema
>;
