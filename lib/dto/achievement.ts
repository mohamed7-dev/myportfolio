import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  dateTimeFilterOperators,
  deletionResponseSchema,
  idSchema,
  inputIdSchema,
  inputIdsSchema,
  sortDirection,
  stringFilterOperators,
} from "./common";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

export enum AchievementType {
  CERTIFICATE = "CERTIFICATE",
  COURSE = "COURSE",
  INTERNSHIP = "INTERNSHIP",
}

export const achievementTypeSchema = z.nativeEnum(AchievementType);

const achievementTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty({ message: "Achievement name is required" }),
  slug: z.string().nonempty({ message: "Achievement slug is required" }),
  organization: z
    .string()
    .nonempty({ message: "Organization name is required" }),
});

const achievementTranslationFieldsSchema = achievementTranslationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const achievementAssetSchema = entityAssetSchema.extend({
  achievementId: idSchema,
});

export type AchievementAsset = z.infer<typeof achievementAssetSchema>;

export const achievement = baseSchema
  .extend(achievementTranslationFieldsSchema.shape)
  .extend({
    type: achievementTypeSchema,
    credentialUrl: z.string().min(1, { message: "Credential URL is required" }),
    issueDate: z.coerce.date(),
    translations: z.array(achievementTranslationSchema),
    assets: z.array(achievementAssetSchema),
    featuredAsset: asset,
  });

export type Achievement = z.infer<typeof achievement>;

const achievementTranslationInputSchema = achievementTranslationFieldsSchema;

//############################ Create #############################
export const createAchievementInputSchema = z
  .object({
    type: z
      .string()
      .min(1, "Achievement type is required")
      .pipe(achievementTypeSchema),
    credentialUrl: z.string().min(1, { message: "Credential URL is required" }),
    issueDate: z.coerce.date().nullable(),
    assetIds: z.array(idSchema).min(1, { message: "Assets are required" }),
    translations: z.array(achievementTranslationInputSchema),
    featuredAssetId: idSchema.min(1, { message: "Featured asset is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.issueDate === null) {
      ctx.addIssue({
        code: "custom",
        path: ["issueDate"],
        message: "Issue date is required.",
      });
    }
  });

export type CreateAchievementFormInputSchema = z.input<
  typeof createAchievementInputSchema
>;
export type CreateAchievementInputSchema = z.output<
  typeof createAchievementInputSchema
>;

export const createAchievementOutputSchema = z.union([
  achievement,
  apiErrorSchema,
]);

export type CreateAchievementOutputSchema = z.infer<
  typeof createAchievementOutputSchema
>;

//############################ Update #############################
export const updateAchievementInputSchema = z.object({
  id: idSchema,
  type: z
    .string()
    .min(1, "Achievement type is required")
    .pipe(achievementTypeSchema)
    .optional(),
  credentialUrl: z
    .string()
    .min(1, {
      message: "Credential URL is required",
    })
    .optional(),
  issueDate: z.coerce.date().nullish(),
  translations: z
    .array(
      achievementTranslationInputSchema
        .partial()
        .extend(
          achievementTranslationInputSchema.pick({ languageCode: true }).shape,
        ),
    )
    .optional(),
  assetIds: z.array(idSchema).optional(),
  featuredAssetId: idSchema.optional(),
});

export type UpdateAchievementFormInputSchema = z.input<
  typeof updateAchievementInputSchema
>;

export type UpdateAchievementInputSchema = z.output<
  typeof updateAchievementInputSchema
>;

export const updateAchievementOutputSchema = z.union([
  achievement,
  apiErrorSchema,
]);

export type UpdateAchievementOutputSchema = z.infer<
  typeof updateAchievementOutputSchema
>;

// ################## Delete ####################

export const deleteAchievementsInputSchema = inputIdsSchema;

export type DeleteAchievementsInputSchema = z.infer<
  typeof deleteAchievementsInputSchema
>;

export const deleteAchievementsOutputSchema = z.union([
  z.array(deletionResponseSchema),
  apiErrorSchema,
]);

export type DeleteAchievementsOutputSchema = z.infer<
  typeof deleteAchievementsOutputSchema
>;

//###################### List #######################
export const achievementListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      slug: stringFilterOperators,
      organization: stringFilterOperators,
      type: stringFilterOperators,
      credentialUrl: stringFilterOperators,
      issueDate: dateTimeFilterOperators,
    })
    .partial(),
  z
    .object({
      name: sortDirection,
      slug: sortDirection,
      organization: sortDirection,
      type: sortDirection,
      credentialUrl: sortDirection,
      issueDate: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
    })
    .partial(),
);
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
