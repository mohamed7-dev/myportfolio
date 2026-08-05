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
  paginatedSoftDeletableListInputSchema,
} from "./paginated-list";

const projectTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  slug: z.string().optional(),
  overview: z.string().nonempty(),
  features: z.string().nonempty(),
  technicalHighlights: z.string().nonempty(),
  contributions: z.string().nonempty(),
  challengesAndSolutions: z.string().nonempty(),
  techStack: z.string().nonempty(),
});

const projectTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  slug: z.string().optional(),
  overview: z.string().nonempty(),
  features: z.string().nonempty(),
  technicalHighlights: z.string().nonempty(),
  contributions: z.string().nonempty(),
  challengesAndSolutions: z.string().nonempty(),
  techStack: z.string().nonempty(),
});

const projectAssetSchema = entityAssetSchema.extend({
  projectId: z.string(),
});

export type ProjectAsset = z.infer<typeof projectAssetSchema>;

export const project = baseSchema.extend({
  liveDemoUrl: z.string().url(),
  repoUrl: z.string().url(),
  enabled: z.boolean(),
  languageCode: languageCodeSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  overview: z.string(),
  features: z.string(),
  technicalHighlights: z.string(),
  contributions: z.string(),
  challengesAndSolutions: z.string(),
  techStack: z.string(),
  translations: z.array(projectTranslationSchema),
  assets: z.array(projectAssetSchema),
  featuredAsset: asset,
  deletedAt: z.coerce.date().nullable(),
});

export type Project = z.infer<typeof project>;

//####################### Create #######################

export const createProjectInputSchema = z.object({
  enabled: z.boolean(),
  liveDemoUrl: z.string().url(),
  repoUrl: z.string().url().nonempty(),
  assetIds: z.array(z.string()).nonempty(),
  featuredAssetId: z.string().optional(),
  translations: z.array(projectTranslationInputSchema).nonempty(),
  careerId: z.string().optional(),
  educationItemId: z.string().optional(),
  achievementIds: z.array(z.string()).optional(),
});

export type CreateProjectInputSchema = z.infer<typeof createProjectInputSchema>;

export const createProjectOutputSchema = project;

export type CreateProjectOutputSchema = z.infer<
  typeof createProjectOutputSchema
>;

//####################### Update #######################

export const updateProjectInputSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  liveDemoUrl: z.string().url(),
  repoUrl: z.string().url().nonempty(),
  assetIds: z.array(z.string()).nonempty(),
  featuredAssetId: z.string().optional(),
  translations: z.array(projectTranslationInputSchema).nonempty(),
  careerId: z.string().optional(),
  educationItemId: z.string().optional(),
  achievementIds: z.array(z.string()).optional(),
});

export type UpdateProjectInputSchema = z.infer<typeof updateProjectInputSchema>;

export const updateProjectOutputSchema = project;

export type UpdateProjectOutputSchema = z.infer<
  typeof updateProjectOutputSchema
>;

//####################### Delete #######################

export const softDeleteProjectsInputSchema = inputIdsSchema;

export type SoftDeleteProjectsInputSchema = z.infer<
  typeof softDeleteProjectsInputSchema
>;

export const softDeleteProjectsOutputSchema = z.array(deletionResponseSchema);

export type SoftDeleteProjectsOutputSchema = z.infer<
  typeof softDeleteProjectsOutputSchema
>;

export const deleteProjectInputSchema = inputIdSchema;

export type DeleteProjectInputSchema = z.infer<typeof deleteProjectInputSchema>;

export const deleteProjectOutputSchema = deletionResponseSchema;

export type DeleteProjectOutputSchema = z.infer<
  typeof deleteProjectOutputSchema
>;

//###################### List #######################
export const projectListInputSchema =
  paginatedSoftDeletableListInputSchema.extend({
    filter: z
      .object({
        name: z.object({ contains: z.string() }).optional(),
        enabled: z.object({ equals: z.boolean() }).optional(),
        liveDemoUrl: z.object({ contains: z.string() }).optional(),
        repoUrl: z.object({ contains: z.string() }).optional(),
      })
      .optional(),
  });
export type ProjectListInputSchema = z.infer<typeof projectListInputSchema>;

export const projectListOutputSchema = createPaginatedListOutputSchema(project);

export type ProjectListOutputSchema = z.infer<typeof projectListOutputSchema>;
