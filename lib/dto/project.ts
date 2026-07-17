import { z } from "@/lib/helpers/zod";
import { asset } from "./asset";
import { languageCodeSchema } from "./language-code";
import { createPaginatedListOutputSchema } from "./paginated-list";

const projectTranslationInputSchema = z.object({
  languageCode: languageCodeSchema,
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

const projectTranslationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  languageCode: languageCodeSchema,
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

const projectAssetSchema = z.object({
  position: z.number(),
  asset: asset,
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProjectAsset = z.infer<typeof projectAssetSchema>;

export const project = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
});

export type CreateProjectInputSchema = z.infer<typeof createProjectInputSchema>;

//####################### Update #######################

export const updateProjectInputSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  liveDemoUrl: z.string().url(),
  repoUrl: z.string().url().nonempty(),
  assetIds: z.array(z.string()).nonempty(),
  featuredAssetId: z.string().optional(),
  translations: z.array(projectTranslationInputSchema).nonempty(),
});

export type UpdateProjectInputSchema = z.infer<typeof updateProjectInputSchema>;

//###################### List #######################
export const projectListOutputSchema = createPaginatedListOutputSchema(project);

export type ProjectListOutputSchema = z.infer<typeof projectListOutputSchema>;
