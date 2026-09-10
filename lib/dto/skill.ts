import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  booleanFilterOperators,
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

export enum SkillCategory {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  TOOLS = "TOOLS",
  PROGRAMMING_LANGUAGES = "PROGRAMMING_LANGUAGES",
}

const skillCategorySchema = z.nativeEnum(SkillCategory);

const skillTranslationSchema = baseTranslationEntity.extend({
  name: z.string().min(1, { message: "Skill name is required" }),
  slug: z.string().min(1, { message: "Skill slug is required" }),
});

const skillTranslationFieldsSchema = skillTranslationSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

const skillAssetSchema = entityAssetSchema.extend({
  skillId: idSchema,
});

export type SkillAsset = z.infer<typeof skillAssetSchema>;

export const skill = baseSchema
  .extend(skillTranslationFieldsSchema.shape)
  .extend({
    isFeatured: z.boolean(),
    category: skillCategorySchema,
    assets: z.array(skillAssetSchema),
    featuredAsset: asset,
    translations: z.array(skillTranslationSchema),
  });

export type Skill = z.infer<typeof skill>;

const skillTranslationInputSchema = baseTranslationEntityInput.extend(
  skillTranslationFieldsSchema.shape,
);

//############################ Create #############################
export const createSkillInputSchema = z.object({
  category: z.string().min(1, "Category is required").pipe(skillCategorySchema),
  assetIds: z.array(idSchema).min(1, { message: "Assets are required" }),
  translations: z.array(skillTranslationInputSchema),
  featuredAssetId: idSchema.min(1, { message: "Featured asset is required" }),
  isFeatured: z.boolean().optional(),
});

export type CreateSkillFormInput = z.input<typeof createSkillInputSchema>;

export type CreateSkillInputSchema = z.output<typeof createSkillInputSchema>;

export const createSkillOutputSchema = z.union([
  skill.omit({ assets: true, featuredAsset: true }),
  apiErrorSchema,
]);

export type CreateSkillOutputSchema = z.infer<typeof createSkillOutputSchema>;

//############################ Update #############################
export const updateSkillInputSchema = createSkillInputSchema.partial().extend({
  id: idSchema,
});

export type UpdateSkillFormInput = z.input<typeof updateSkillInputSchema>;

export type UpdateSkillInputSchema = z.output<typeof updateSkillInputSchema>;

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
