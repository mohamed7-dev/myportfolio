import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  booleanFilterOperators,
  dateTimeFilterOperators,
  deletionResponseSchema,
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
  school: z.string().nonempty(),
  slug: z.string().nonempty(),
  degree: z.string().optional(),
  location: z.string().optional(),
});

const educationAssetSchema = entityAssetSchema.extend({
  educationId: z.string(),
});

export type EducationAsset = z.infer<typeof educationAssetSchema>;

export const education = baseSchema.extend({
  school: z.string().nonempty(),
  slug: z.string().nonempty(),
  degree: z.string().nullish(),
  location: z.string().nullish(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  isPresent: z.boolean(),
  gpa: z.number().nullish(),
  translations: z.array(educationTranslationSchema),
  assets: z.array(educationAssetSchema),
  featuredAsset: asset,
});

export type Education = z.infer<typeof education>;

const educationTranslationInputSchema = baseTranslationEntityInput.extend({
  school: z.string().nonempty(),
  slug: z.string().nonempty(),
  degree: z.string().optional(),
  location: z.string().optional(),
});

//############################ Create #############################
export const createEducationInputSchema = z.object({
  assetIds: z.array(z.string()),
  translations: z.array(educationTranslationInputSchema),
  featuredAssetId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  isPresent: z.boolean(),
  gpa: z.coerce.number().nullish(),
});

export type CreateEducationInputSchema = z.infer<
  typeof createEducationInputSchema
>;

export const createEducationOutputSchema = z.union([education, apiErrorSchema]);

export type CreateEducationOutputSchema = z.infer<
  typeof createEducationOutputSchema
>;

//############################ Update #############################
export const updateEducationInputSchema = z.object({
  id: z.string(),
  translations: z
    .array(
      educationTranslationInputSchema
        .partial()
        .extend(
          educationTranslationInputSchema.pick({ languageCode: true }).shape,
        ),
    )
    .optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullish().optional(),
  isPresent: z.boolean().optional(),
  gpa: z.number().nullish().optional(),
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
