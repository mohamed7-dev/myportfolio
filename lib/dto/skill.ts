import { z } from "@/lib/helpers/zod";
import { asset } from "./asset";
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

const skillTranslationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  languageCode: languageCodeSchema,
  name: z.string().nonempty(),
  slug: z.string().optional(),
});

const skillAssetSchema = z.object({
  position: z.number(),
  asset: asset,
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SkillAsset = z.infer<typeof skillAssetSchema>;

export const skill = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  slug: z.string(),
  category: skillCategorySchema,
  assets: z.array(skillAssetSchema),
  featuredAsset: asset.nullable(),
  translations: z.array(skillTranslationSchema),
});

export type Skill = z.infer<typeof skill>;

const skillTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
  name: z.string().nonempty(),
  slug: z.string().optional(),
});

//############################ Create #############################
export const createSkillInputSchema = z.object({
  category: skillCategorySchema,
  assetIds: z.array(z.string()).nonempty(),
  translations: z.array(skillTranslationInputSchema).nonempty(),
  featuredAssetId: z.string().optional(),
});

export type CreateSkillInputSchema = z.infer<typeof createSkillInputSchema>;

//############################ Update #############################
export const updateSkillInputSchema = z.object({
  id: z.string(),
  category: skillCategorySchema.optional(),
  assetIds: z.array(z.string()).nonempty(),
  featuredAssetId: z.string().optional(),
  translations: z.array(skillTranslationInputSchema).nonempty(),
});

export type UpdateSkillInputSchema = z.infer<typeof updateSkillInputSchema>;

//####################### Delete #######################

export const deleteSkillsInputSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteSkillsInputSchema = z.infer<typeof deleteSkillsInputSchema>;

//###################### List #######################
export const skillListInputSchema = paginatedListInputSchema.extend({
  filter: z
    .object({
      name: z.object({ contains: z.string() }).optional(),
      category: z.object({ equals: skillCategorySchema }).optional(),
    })
    .optional(),
});
export type SkillListInputSchema = z.infer<typeof skillListInputSchema>;

export const skillListOutputSchema = createPaginatedListOutputSchema(skill);

export type SkillListOutputSchema = z.infer<typeof skillListOutputSchema>;
