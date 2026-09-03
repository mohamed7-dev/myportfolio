import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  booleanFilterOperators,
  deletionResponseSchema,
  inputIdSchema,
  inputIdsSchema,
  sortDirection,
  stringFilterOperators,
} from "./common";
import { languageCodeSchema } from "./language-code";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

export enum SkillCategory {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  TOOLS = "TOOLS",
  PROGRAMMING_LANGUAGES = "PROGRAMMING_LANGUAGES",
}

const skillCategorySchema = z.nativeEnum(SkillCategory);

const skillTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty(),
  slug: z.string().optional(),
});

const skillAssetSchema = entityAssetSchema.extend({
  skillId: z.string(),
});

export type SkillAsset = z.infer<typeof skillAssetSchema>;

export const skill = baseSchema.extend({
  name: z.string(),
  slug: z.string(),
  isFeatured: z.boolean(),
  category: skillCategorySchema,
  assets: z.array(skillAssetSchema),
  featuredAsset: asset,
  translations: z.array(skillTranslationSchema),
});

export type Skill = z.infer<typeof skill>;

const skillTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string(),
  slug: z.string(),
});

//############################ Create #############################
export const createSkillInputSchema = z.object({
  category: skillCategorySchema,
  assetIds: z.array(z.string()),
  translations: z.array(skillTranslationInputSchema),
  featuredAssetId: z.string(),
  isFeatured: z.boolean().optional(),
});

export type CreateSkillInputSchema = z.infer<typeof createSkillInputSchema>;

export const createSkillOutputSchema = z.union([skill, apiErrorSchema]);

export type CreateSkillOutputSchema = z.infer<typeof createSkillOutputSchema>;

//############################ Update #############################
export const updateSkillInputSchema = z.object({
  id: z.string(),
  category: skillCategorySchema.optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
  translations: z
    .array(
      skillTranslationInputSchema
        .partial()
        .extend({ languageCode: languageCodeSchema }),
    )
    .optional(),
  isFeatured: z.boolean().optional(),
});

export type UpdateSkillInputSchema = z.infer<typeof updateSkillInputSchema>;

export const updateSkillOutputSchema = z.union([skill, apiErrorSchema]);

export type UpdateSkillOutputSchema = z.infer<typeof updateSkillOutputSchema>;

//###################### List #######################
export const skillListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      category: stringFilterOperators,
      isFeatured: booleanFilterOperators,
      slug: stringFilterOperators,
    })
    .partial(),
  z
    .object({
      name: sortDirection,
      category: sortDirection,
      isFeatured: sortDirection,
      slug: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
    })
    .partial(),
);

export type SkillListInputSchema = z.infer<typeof skillListInputSchema>;

export const skillListOutputSchema = createPaginatedListOutputSchema(skill);

export type SkillListOutputSchema = z.infer<typeof skillListOutputSchema>;

// ################## Delete ####################

export const deleteSkillsInputSchema = inputIdsSchema;

export type DeleteSkillsInputSchema = z.infer<typeof deleteSkillsInputSchema>;

export const deleteSkillsOutputSchema = z.union([
  z.array(deletionResponseSchema),
  apiErrorSchema,
]);

export type DeleteSkillsOutputSchema = z.infer<typeof deleteSkillsOutputSchema>;

//###################### Find One #######################
export const findOneSkillInputSchema = inputIdSchema;

export type FindOneSkillInputSchema = z.infer<typeof findOneSkillInputSchema>;

export const findOneSkillOutputSchema = skill;

export type FindOneSkillOutputSchema = z.infer<typeof findOneSkillOutputSchema>;
