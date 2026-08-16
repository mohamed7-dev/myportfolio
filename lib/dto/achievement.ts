import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  deletionResponseSchema,
  inputIdSchema,
  inputIdsSchema,
} from "./common";
import {
  createPaginatedListOutputSchema,
  paginatedListInputSchema,
} from "./paginated-list";

export enum AchievementType {
  CERTIFICATE = "CERTIFICATE",
  COURSE = "COURSE",
  INTERNSHIP = "INTERNSHIP",
}

export const achievementTypeSchema = z.nativeEnum(AchievementType);

const achievementTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  organization: z.string().nonempty(),
});

const achievementAssetSchema = entityAssetSchema.extend({
  achievementId: z.string(),
});

export type AchievementAsset = z.infer<typeof achievementAssetSchema>;

export const achievement = baseSchema.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  organization: z.string().nonempty(),
  type: achievementTypeSchema,
  credentialUrl: z.string(),
  issueDate: z.coerce.date(),
  translations: z.array(achievementTranslationSchema),
  assets: z.array(achievementAssetSchema),
  featuredAsset: asset,
});

export type Achievement = z.infer<typeof achievement>;

const achievementTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  organization: z.string().nonempty(),
});

//############################ Create #############################
export const createAchievementInputSchema = z.object({
  type: achievementTypeSchema,
  credentialUrl: z.string(),
  issueDate: z.coerce.date(),
  assetIds: z.array(z.string()),
  translations: z.array(achievementTranslationInputSchema),
  featuredAssetId: z.string(),
});

export type CreateAchievementInputSchema = z.infer<
  typeof createAchievementInputSchema
>;

export const createAchievementOutputSchema = achievement;

export type CreateAchievementOutputSchema = z.infer<
  typeof createAchievementOutputSchema
>;

//############################ Update #############################
export const updateAchievementInputSchema = z.object({
  id: z.string(),
  type: achievementTypeSchema.optional(),
  credentialUrl: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  translations: z
    .array(
      achievementTranslationInputSchema
        .partial()
        .extend(
          achievementTranslationInputSchema.pick({ languageCode: true }).shape,
        ),
    )
    .optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
});

export type UpdateAchievementInputSchema = z.infer<
  typeof updateAchievementInputSchema
>;

export const updateAchievementOutputSchema = achievement;

export type UpdateAchievementOutputSchema = z.infer<
  typeof updateAchievementOutputSchema
>;

// ################## Delete ####################

export const deleteAchievementsInputSchema = inputIdsSchema;

export type DeleteAchievementsInputSchema = z.infer<
  typeof deleteAchievementsInputSchema
>;

export const deleteAchievementsOutputSchema = z.array(deletionResponseSchema);

export type DeleteAchievementsOutputSchema = z.infer<
  typeof deleteAchievementsOutputSchema
>;

//###################### List #######################
export const achievementListInputSchema = paginatedListInputSchema.extend({
  filter: z
    .object({
      name: z.object({ contains: z.string() }).optional(),
    })
    .optional(),
});
export type AchievementListInputSchema = z.infer<
  typeof achievementListInputSchema
>;

export const achievementListOutputSchema =
  createPaginatedListOutputSchema(achievement);

export type AchievementListOutputSchema = z.infer<
  typeof achievementListOutputSchema
>;

//###################### Find One #######################
export const findOneAchievementInputSchema = inputIdSchema;

export type FindOneAchievementInputSchema = z.infer<
  typeof findOneAchievementInputSchema
>;

export const findOneAchievementOutputSchema = achievement;

export type FindOneAchievementOutputSchema = z.infer<
  typeof findOneAchievementOutputSchema
>;
