import { z } from "@/lib/helpers/zod";
import { achievement } from "./achievement";
import { career } from "./career";
import { contactMethod } from "./contact-method";
import { education } from "./education";
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

// ################### Featured Careers ############################
const featuredCareer = career.omit({
  assets: true,
  translations: true,
});

export const getFeaturedCareersOutputSchema =
  createPaginatedListOutputSchema(featuredCareer);

export type GetFeaturedCareersOutputSchema = z.infer<
  typeof getFeaturedCareersOutputSchema
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

// ################### Projects ############################
const publicProjectInList = project
  .pick({
    id: true,
    liveDemoUrl: true,
    repoUrl: true,
    finished: true,
    featured: true,
    languageCode: true,
    name: true,
    slug: true,
    description: true,
    featuredAsset: true,
    career: true,
    education: true,
    translations: true,
  })
  .extend({
    skills: z.array(skill.pick({ id: true, name: true, slug: true })),
  });

export const getPublicProjectsOutputSchema =
  createPaginatedListOutputSchema(publicProjectInList);

export type GetPublicProjectsOutputSchema = z.infer<
  typeof getPublicProjectsOutputSchema
>;

// ################### Project ############################

export const getPublicProjectInputSchema = z.object({
  slug: z.string().transform((slug) => decodeURIComponent(slug)),
});

export type GetPublicProjectInputSchema = z.infer<
  typeof getPublicProjectInputSchema
>;

const publicProject = project
  .pick({
    id: true,
    liveDemoUrl: true,
    repoUrl: true,
    finished: true,
    featured: true,
    languageCode: true,
    name: true,
    slug: true,
    description: true,
    overview: true,
    features: true,
    technicalHighlights: true,
    contributions: true,
    challengesAndSolutions: true,
    techStack: true,
    featuredAsset: true,
    assets: true,
  })
  .extend({
    skills: z.array(
      skill.pick({
        id: true,
        name: true,
        featuredAsset: true,
      }),
    ),
    career: career
      .pick({
        id: true,
        slug: true,
        name: true,
        featuredAsset: true,
      })
      .nullish(),
    education: education
      .pick({
        id: true,
        slug: true,
        school: true,
        featuredAsset: true,
      })
      .nullish(),
    achievements: z
      .array(
        achievement.pick({
          id: true,
          slug: true,
          name: true,
          featuredAsset: true,
        }),
      )
      .nullish(),
  });

export const getPublicProjectOutputSchema = publicProject;

export type GetPublicProjectOutputSchema = z.infer<
  typeof getPublicProjectOutputSchema
>;

// ################### Contact Methods ############################
const publicContactMethodInList = contactMethod.pick({
  id: true,
  name: true,
  enabled: true,
  primary: true,
  featuredAsset: true,
  copyableText: true,
  url: true,
});

export const getPublicContactMethodsOutputSchema =
  createPaginatedListOutputSchema(publicContactMethodInList);

export type GetPublicContactMethodsOutputSchema = z.infer<
  typeof getPublicContactMethodsOutputSchema
>;

// ################### Achievements ############################
const publicAchievementInList = achievement.pick({
  id: true,
  name: true,
  slug: true,
  featuredAsset: true,
  organization: true,
  issueDate: true,
  type: true,
  credentialUrl: true,
  assets: true,
});

export const getPublicAchievementsOutputSchema =
  createPaginatedListOutputSchema(publicAchievementInList);

export type GetPublicAchievementsOutputSchema = z.infer<
  typeof getPublicAchievementsOutputSchema
>;

// ################### Career ############################
const publicCareerInList = career.pick({
  id: true,
  name: true,
  slug: true,
  location: true,
  organization: true,
  responsibilities: true,
  learned: true,
  impact: true,
  featuredAsset: true,
  type: true,
  mode: true,
  startDate: true,
  endDate: true,
  isPresent: true,
});

export const getPublicCareerOutputSchema =
  createPaginatedListOutputSchema(publicCareerInList);

export type GetPublicCareerOutputSchema = z.infer<
  typeof getPublicCareerOutputSchema
>;

// ################### Education ############################
const publicEducationInList = education.pick({
  id: true,
  school: true,
  slug: true,
  location: true,
  degree: true,
  featuredAsset: true,
  startDate: true,
  endDate: true,
  isPresent: true,
  assets: true,
});

export const getPublicEducationOutputSchema = createPaginatedListOutputSchema(
  publicEducationInList,
);

export type GetPublicEducationOutputSchema = z.infer<
  typeof getPublicEducationOutputSchema
>;
