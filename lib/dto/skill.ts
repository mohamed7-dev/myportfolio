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
import { languageCodeSchema } from "./language-code";
import {
  createPaginatedListOutputSchema,
  paginatedListInputSchema,
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

export const createSkillOutputSchema = skill;

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

export const updateSkillOutputSchema = skill;

export type UpdateSkillOutputSchema = z.infer<typeof updateSkillOutputSchema>;

//###################### List #######################
export const skillListInputSchema = paginatedListInputSchema.extend({
  filter: z
    .object({
      name: z.object({ contains: z.string() }).optional(),
      category: z.object({ equals: skillCategorySchema }).optional(),
      isFeatured: z.object({ equals: z.boolean() }).optional(),
    })
    .optional(),
});
export type SkillListInputSchema = z.infer<typeof skillListInputSchema>;

export const skillListOutputSchema = createPaginatedListOutputSchema(skill);

export type SkillListOutputSchema = z.infer<typeof skillListOutputSchema>;

// ################## Delete ####################

export const deleteSkillsInputSchema = inputIdsSchema;

export type DeleteSkillsInputSchema = z.infer<typeof deleteSkillsInputSchema>;

export const deleteSkillsOutputSchema = z.array(deletionResponseSchema);

export type DeleteSkillsOutputSchema = z.infer<typeof deleteSkillsOutputSchema>;

//###################### Find One #######################
export const findOneSkillInputSchema = inputIdSchema;

export type FindOneSkillInputSchema = z.infer<typeof findOneSkillInputSchema>;

export const findOneSkillOutputSchema = skill;

export type FindOneSkillOutputSchema = z.infer<typeof findOneSkillOutputSchema>;
