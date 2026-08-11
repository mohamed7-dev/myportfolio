import type { z } from "@/lib/helpers/zod";
import { createPaginatedListOutputSchema } from "./paginated-list";
import { clientSafeSchema } from "./profile";
import { project } from "./project";
import { skill } from "./skill";

//##################### Profile #######################
export const getSuperAdminProfileOutputSchema = clientSafeSchema
  .pick({
    languageCode: true,
    summary: true,
    displayName: true,
    username: true,
    handle: true,
    projectsShipped: true,
    openSourceContributions: true,
    yearsOfExperience: true,
    intro: true,
    subHeading: true,
    subtitle: true,
    jobTitle: true,
    location: true,
    currentFocus: true,
    assets: true,
  })
  .extend({
    avatar: clientSafeSchema.shape.featuredAsset,
  });

export type GetSuperAdminProfileOutputSchema = z.infer<
  typeof getSuperAdminProfileOutputSchema
>;

// ################### Featured Skills ############################
const featuredSkill = skill.omit({
  assets: true,
  translations: true,
});

export const getFeaturedSkillsOutputSchema =
  createPaginatedListOutputSchema(featuredSkill);

export type GetFeaturedSkillsOutputSchema = z.infer<
  typeof getFeaturedSkillsOutputSchema
>;

// ################### Featured Projects ############################
const featuredProject = project.pick({
  id: true,
  name: true,
  slug: true,
  featuredAsset: true,
  featured: true,
});

export const getFeaturedProjectsOutputSchema =
  createPaginatedListOutputSchema(featuredProject);

export type GetFeaturedProjectsOutputSchema = z.infer<
  typeof getFeaturedProjectsOutputSchema
>;

// ################### Skills ############################
const publicSkill = skill.omit({
  assets: true,
  translations: true,
});

export const getSkillsOutputSchema =
  createPaginatedListOutputSchema(publicSkill);

export type GetSkillsOutputSchema = z.infer<typeof getSkillsOutputSchema>;
