import { z } from "@/lib/helpers/zod";
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
  numericFilterOperators,
  sortDirection,
  stringFilterOperators,
} from "./common";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

const educationTranslationSchema = baseTranslationEntity.extend({
  school: z.string().nonempty({ message: "School name is required" }),
  slug: z.string().nonempty({ message: "School slug is required" }),
  degree: z.string().nullable(),
  location: z.string().nullable(),
});

const educationTranslationFieldsSchema = educationTranslationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const educationAssetSchema = entityAssetSchema.extend({
  educationId: idSchema,
});

export type EducationAsset = z.infer<typeof educationAssetSchema>;

export const education = baseSchema
  .extend(educationTranslationFieldsSchema.shape)
  .extend({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    isPresent: z.boolean(),
    gpa: z.number().nullable(),
    translations: z.array(educationTranslationSchema),
    assets: z.array(educationAssetSchema),
    featuredAsset: asset,
  });

export type Education = z.infer<typeof education>;

const educationTranslationInputSchema = educationTranslationFieldsSchema;

//############################ Create #############################
export const createEducationInputSchema = z
  .object({
    assetIds: z.array(idSchema).min(1, { message: "Assets are required" }),
    translations: z.array(educationTranslationInputSchema),
    featuredAssetId: idSchema.min(1, { message: "Featured asset is required" }),
    startDate: z.coerce.date().nullable(),
    endDate: z.coerce.date().nullable(),
    isPresent: z.boolean(),
    gpa: z.coerce
      .number()
      .gt(0, { message: "GPA must be greater than 0" })
      .nullish(),
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

export type CreateEducationInputSchema = z.infer<
  typeof createEducationInputSchema
>;

export const createEducationOutputSchema = z.union([
  education.omit({ assets: true, featuredAsset: true }),
  apiErrorSchema,
]);

export type CreateEducationOutputSchema = z.infer<
  typeof createEducationOutputSchema
>;

//############################ Update #############################
export const updateEducationInputSchema = z
  .object({
    id: idSchema,
    translations: z
      .array(
        educationTranslationInputSchema
          .partial()
          .extend(
            educationTranslationInputSchema.pick({ languageCode: true }).shape,
          ),
      )
      .optional(),
    assetIds: z.array(idSchema).optional(),
    featuredAssetId: idSchema.optional(),
    startDate: z.coerce.date().nullish(),
    endDate: z.coerce.date().nullish(),
    isPresent: z.boolean().optional(),
    gpa: z.coerce
      .number()
      .gt(0, { message: "GPA must be greater than 0" })
      .optional(),
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

export type UpdateEducationInputSchema = z.infer<
  typeof updateEducationInputSchema
>;

export const updateEducationOutputSchema = z.union([education, apiErrorSchema]);

export type UpdateEducationOutputSchema = z.infer<
  typeof updateEducationOutputSchema
>;

//###################### List #######################
export const educationListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      school: stringFilterOperators,
      degree: stringFilterOperators,
      location: stringFilterOperators,
      startDate: dateTimeFilterOperators,
      endDate: dateTimeFilterOperators,
      isPresent: booleanFilterOperators,
      slug: stringFilterOperators,
      gpa: numericFilterOperators,
    })
    .partial(),
  z
    .object({
      school: sortDirection,
      degree: sortDirection,
      location: sortDirection,
      startDate: sortDirection,
      endDate: sortDirection,
      isPresent: sortDirection,
      slug: sortDirection,
      gpa: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
    })
    .partial(),
);

export type EducationListInputSchema = z.infer<typeof educationListInputSchema>;

export const educationListOutputSchema =
  createPaginatedListOutputSchema(education);

export type EducationListOutputSchema = z.infer<
  typeof educationListOutputSchema
>;

// ################## Delete ####################

export const deleteEducationsInputSchema = inputIdsSchema;

export type DeleteEducationsInputSchema = z.infer<
  typeof deleteEducationsInputSchema
>;

export const deleteEducationsOutputSchema = z.union([
  z.array(deletionResponseSchema),
  apiErrorSchema,
]);

export type DeleteEducationsOutputSchema = z.infer<
  typeof deleteEducationsOutputSchema
>;

//###################### Find One #######################
export const findOneEducationInputSchema = inputIdSchema;

export type FindOneEducationInputSchema = z.infer<
  typeof findOneEducationInputSchema
>;

export const findOneEducationOutputSchema = education;

export type FindOneEducationOutputSchema = z.infer<
  typeof findOneEducationOutputSchema
>;
