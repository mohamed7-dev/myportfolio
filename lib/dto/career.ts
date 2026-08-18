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

export enum CareerType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  FREELANCE = "FREELANCE",
  INTERNSHIP = "INTERNSHIP",
  TRAINING = "TRAINING",
  CONTRACT = "CONTRACT",
  OPEN_SOURCE_CONTRIBUTION = "OPEN_SOURCE_CONTRIBUTION",
}

export enum CareerMode {
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
}

export const careerTypeSchema = z.nativeEnum(CareerType);
export const careerModeSchema = z.nativeEnum(CareerMode);

const careerTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  location: z.string().nullish(),
  organization: z.string().nonempty(),
  responsibilities: z.string().nonempty(),
  learned: z.string().nonempty(),
  impact: z.string().nonempty(),
});

const careerAssetSchema = entityAssetSchema.extend({
  careerId: z.string(),
});

export type CareerAsset = z.infer<typeof careerAssetSchema>;

export const career = baseSchema.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  location: z.string().nullish(),
  organization: z.string().nonempty(),
  responsibilities: z.string().nonempty(),
  learned: z.string().nonempty(),
  impact: z.string().nonempty(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  isPresent: z.boolean(),
  mode: careerModeSchema,
  type: careerTypeSchema,
  translations: z.array(careerTranslationSchema),
  assets: z.array(careerAssetSchema),
  featuredAsset: asset,
});

export type Career = z.infer<typeof career>;

const careerTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  organization: z.string().nonempty(),
  responsibilities: z.string().nonempty(),
  learned: z.string().nonempty(),
  impact: z.string().nonempty(),
  location: z.string().nullish(),
});

//############################ Create #############################
export const createCareerInputSchema = z.object({
  assetIds: z.array(z.string()),
  translations: z.array(careerTranslationInputSchema),
  featuredAssetId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  isPresent: z.boolean(),
  type: careerTypeSchema,
  mode: careerModeSchema,
  achievementIds: z.array(z.string()).optional(),
});

export type CreateCareerInputSchema = z.infer<typeof createCareerInputSchema>;

export const createCareerOutputSchema = career;

export type CreateCareerOutputSchema = z.infer<typeof createCareerOutputSchema>;

//############################ Update #############################
export const updateCareerInputSchema = z.object({
  id: z.string(),
  translations: z
    .array(
      careerTranslationInputSchema
        .partial()
        .extend(
          careerTranslationInputSchema.pick({ languageCode: true }).shape,
        ),
    )
    .optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullish().optional(),
  isPresent: z.boolean().optional(),
  type: careerTypeSchema.optional(),
  mode: careerModeSchema.optional(),
  achievementIds: z.array(z.string()).optional(),
});

export type UpdateCareerInputSchema = z.infer<typeof updateCareerInputSchema>;

export const updateCareerOutputSchema = career;

export type UpdateCareerOutputSchema = z.infer<typeof updateCareerOutputSchema>;

// ################## Delete ####################

export const deleteCareersInputSchema = inputIdsSchema;

export type DeleteCareersInputSchema = z.infer<typeof deleteCareersInputSchema>;

export const deleteCareersOutputSchema = z.array(deletionResponseSchema);

export type DeleteCareersOutputSchema = z.infer<
  typeof deleteCareersOutputSchema
>;

//###################### List #######################
export const careerListInputSchema = paginatedListInputSchema.extend({
  filter: z
    .object({
      name: z.object({ contains: z.string() }).optional(),
      organization: z.object({ contains: z.string() }).optional(),
      location: z.object({ contains: z.string() }).optional(),
      startDate: z.object({ equals: z.coerce.date() }).optional(),
      endDate: z.object({ equals: z.coerce.date() }).optional(),
      isPresent: z.object({ equals: z.boolean() }).optional(),
    })
    .optional(),
});
export type CareerListInputSchema = z.infer<typeof careerListInputSchema>;

export const careerListOutputSchema = createPaginatedListOutputSchema(career);

export type CareerListOutputSchema = z.infer<typeof careerListOutputSchema>;

//###################### Find One #######################
export const findOneCareerInputSchema = inputIdSchema;

export type FindOneCareerInputSchema = z.infer<typeof findOneCareerInputSchema>;

export const findOneCareerOutputSchema = career;

export type FindOneCareerOutputSchema = z.infer<
  typeof findOneCareerOutputSchema
>;
