import { z } from "@/lib/helpers/zod";
import { achievement } from "./achievement";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  booleanFilterOperators,
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
  name: z.string().nonempty({ message: "Career name is required" }),
  slug: z.string().nonempty({ message: "Career slug is required" }),
  organization: z.string().nonempty({ message: "Organization is required" }),
  location: z.string().nullable(),
  responsibilities: z.string().nonempty({
    message: "Your responsibilities during this career is required",
  }),
  learned: z
    .string()
    .nonempty({ message: "What you have learned in this career is required" }),
  impact: z
    .string()
    .nonempty({ message: "Your impact on this career is required" }),
});

const careerTranslationFieldsSchema = careerTranslationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const careerAssetSchema = entityAssetSchema.extend({
  careerId: idSchema,
});

export type CareerAsset = z.infer<typeof careerAssetSchema>;

export const career = baseSchema
  .extend(careerTranslationFieldsSchema.shape)
  .extend({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    isPresent: z.boolean(),
    isFeatured: z.boolean(),
    mode: careerModeSchema,
    type: careerTypeSchema,
    translations: z.array(careerTranslationSchema),
    assets: z.array(careerAssetSchema),
    featuredAsset: asset,
    achievements: z.array(achievement).optional(),
  });

export type Career = z.infer<typeof career>;

const careerTranslationInputSchema = careerTranslationFieldsSchema;

//############################ Create #############################
export const createCareerInputSchema = z
  .object({
    assetIds: z.array(idSchema).min(1, { message: "Assets are required" }),
    translations: z.array(careerTranslationInputSchema).min(1),
    featuredAssetId: idSchema.min(1, { message: "Featured asset is required" }),
    startDate: z.coerce.date().nullable(),
    endDate: z.coerce.date().nullable(),
    isPresent: z.boolean(),
    isFeatured: z.boolean().optional(),
    type: z.string().min(1, "Career type is required").pipe(careerTypeSchema),
    mode: z.string().min(1, "Career mode is required").pipe(careerModeSchema),
    achievementIds: z.array(idSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate === null) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date is required.",
      });
    }

    if (data.isPresent) {
      if (data.endDate !== null) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be empty when currently active.",
        });
      }

      return;
    }

    if (data.endDate === null) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date is required.",
      });

      return;
    }

    if (data.startDate !== null && data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date.",
      });
    }
  });
export type CreateCareerFormInputSchema = z.input<
  typeof createCareerInputSchema
>;
export type CreateCareerInputSchema = z.output<typeof createCareerInputSchema>;

export const createCareerOutputSchema = z.union([
  career.omit({ achievements: true, featuredAsset: true, assets: true }),
  apiErrorSchema,
]);

export type CreateCareerOutputSchema = z.infer<typeof createCareerOutputSchema>;

//############################ Update #############################
export const updateCareerInputSchema = z
  .object({
    id: idSchema,
    translations: z
      .array(
        careerTranslationInputSchema
          .partial()
          .extend(
            careerTranslationInputSchema.pick({ languageCode: true }).shape,
          ),
      )
      .optional(),
    assetIds: z.array(idSchema).optional(),
    featuredAssetId: idSchema.optional(),
    startDate: z.coerce.date().nullish(),
    endDate: z.coerce.date().nullish(),
    isPresent: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    type: z
      .string()
      .min(1, "Career type is required")
      .pipe(careerTypeSchema)
      .optional(),
    mode: z
      .string()
      .min(1, "Career mode is required")
      .pipe(careerModeSchema)
      .optional(),
    achievementIds: z.array(idSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPresent) {
      if (data.endDate !== null) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be empty when currently active.",
        });
      }

      return;
    }

    if (
      data.startDate != null &&
      data.endDate != null &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date.",
      });
    }
  });

export type UpdateCareerFormInputSchema = z.input<
  typeof updateCareerInputSchema
>;

export type UpdateCareerInputSchema = z.output<typeof updateCareerInputSchema>;

export const updateCareerOutputSchema = z.union([
  career.omit({ achievements: true }),
  apiErrorSchema,
]);

export type UpdateCareerOutputSchema = z.infer<typeof updateCareerOutputSchema>;

// ################## Delete ####################

export const deleteCareersInputSchema = inputIdsSchema;

export type DeleteCareersInputSchema = z.infer<typeof deleteCareersInputSchema>;

export const deleteCareersOutputSchema = z.union([
  z.array(deletionResponseSchema),
  apiErrorSchema,
]);

export type DeleteCareersOutputSchema = z.infer<
  typeof deleteCareersOutputSchema
>;

//###################### List #######################
export const careerListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      organization: stringFilterOperators,
      location: stringFilterOperators,
      startDate: dateTimeFilterOperators,
      endDate: dateTimeFilterOperators,
      isPresent: booleanFilterOperators,
      isFeatured: booleanFilterOperators,
      slug: stringFilterOperators,
      responsibilities: stringFilterOperators,
      learned: stringFilterOperators,
      impact: stringFilterOperators,
      mode: stringFilterOperators,
      type: stringFilterOperators,
    })
    .partial(),
  z
    .object({
      name: sortDirection,
      organization: sortDirection,
      location: sortDirection,
      startDate: sortDirection,
      endDate: sortDirection,
      isPresent: sortDirection,
      isFeatured: sortDirection,
      slug: sortDirection,
      responsibilities: sortDirection,
      learned: sortDirection,
      impact: sortDirection,
      mode: sortDirection,
      type: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
    })
    .partial(),
);

export type CareerListInputSchema = z.infer<typeof careerListInputSchema>;

export const careerListOutputSchema = createPaginatedListOutputSchema(career);

export type CareerListOutputSchema = z.infer<typeof careerListOutputSchema>;

//###################### Find One #######################
export const findOneCareerInputSchema = inputIdSchema;

export type FindOneCareerInputSchema = z.infer<typeof findOneCareerInputSchema>;

export const findOneCareerOutputSchema = career
  .omit({
    achievements: true,
  })
  .extend({
    achievements: z
      .array(achievement.pick({ id: true, name: true, slug: true }))
      .nullish(),
  });

export type FindOneCareerOutputSchema = z.infer<
  typeof findOneCareerOutputSchema
>;
