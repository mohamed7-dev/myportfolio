import { z } from "@/lib/helpers/zod";
import { achievement } from "./achievement";
import { asset, entityAssetSchema } from "./asset";
import { career } from "./career";
import {
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  deletionResponseSchema,
  inputIdSchema,
  inputIdsSchema,
} from "./common";
import { education } from "./education";
import { languageCodeSchema } from "./language-code";
import {
  createPaginatedListOutputSchema,
  paginatedSoftDeletableListInputSchema,
} from "./paginated-list";
import { skill } from "./skill";

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
  finished: z.boolean(),
  featured: z.boolean(),
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
  career: career.nullish(),
  education: education.nullish(),
  achievements: z.array(achievement).nullish(),
  skills: z.array(skill).optional(), // TODO: remove the optional
});

export type Project = z.infer<typeof project>;

//####################### Create #######################

export const createProjectInputSchema = z.object({
  enabled: z.boolean().optional(),
  finished: z.boolean(),
  featured: z.boolean().optional(),
  liveDemoUrl: z.string().url(),
  repoUrl: z.string().url(),
  assetIds: z.array(z.string()),
  featuredAssetId: z.string().optional(),
  translations: z.array(projectTranslationInputSchema),
  careerId: z.string().optional(),
  educationItemId: z.string().optional(),
  achievementIds: z.array(z.string()).optional(),
  skillIds: z.array(z.string()).optional(), // TODO: remove optional
});

export type CreateProjectInputSchema = z.infer<typeof createProjectInputSchema>;

export const createProjectOutputSchema = project;

export type CreateProjectOutputSchema = z.infer<
  typeof createProjectOutputSchema
>;

//####################### Update #######################

export const updateProjectInputSchema = z.object({
  id: z.string(),
  enabled: z.boolean().optional(),
  finished: z.boolean().optional(),
  featured: z.boolean().optional(),
  liveDemoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
  translations: z
    .array(
      projectTranslationInputSchema
        .partial()
        .extend({ languageCode: languageCodeSchema }),
    )
    .optional(),
  careerId: z.string().optional(),
  educationItemId: z.string().optional(),
  achievementIds: z.array(z.string()).optional(),
  skillIds: z.array(z.string()).optional(),
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
        slug: z.object({ equals: z.string() }).optional(),
        enabled: z.object({ equals: z.boolean() }).optional(),
        featured: z.object({ equals: z.boolean() }).optional(),
        liveDemoUrl: z.object({ contains: z.string() }).optional(),
        repoUrl: z.object({ contains: z.string() }).optional(),
      })
      .optional(),
  });
export type ProjectListInputSchema = z.infer<typeof projectListInputSchema>;

export const projectListOutputSchema = createPaginatedListOutputSchema(project);

export type ProjectListOutputSchema = z.infer<typeof projectListOutputSchema>;

//###################### Find One #######################
export const findOneProjectInputSchema = inputIdSchema;

export type FindOneProjectInputSchema = z.infer<
  typeof findOneProjectInputSchema
>;

export const findOneProjectOutputSchema = project.extend({
  career: career
    .pick({
      id: true,
      name: true,
      slug: true,
      featuredAsset: true,
    })
    .nullish(),
  education: education
    .pick({
      id: true,
      school: true,
      slug: true,
      featuredAsset: true,
    })
    .nullish(),
  achievements: z
    .array(
      achievement.pick({
        id: true,
        name: true,
        slug: true,
        featuredAsset: true,
      }),
    )
    .nullish(),
  skills: z.array(
    skill.pick({
      id: true,
      name: true,
      slug: true,
      featuredAsset: true,
    }),
  ),
});

export type FindOneProjectOutputSchema = z.infer<
  typeof findOneProjectOutputSchema
>;
