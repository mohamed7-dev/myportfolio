import type { RequestContext } from "@/api/request-context/request-context";
import {
  type GetPublicProjectInputSchema,
  getFeaturedCareersOutputSchema,
  getFeaturedProjectsOutputSchema,
  getFeaturedSkillsOutputSchema,
  getPublicAchievementsOutputSchema,
  getPublicCareerOutputSchema,
  getPublicContactMethodsOutputSchema,
  getPublicEducationOutputSchema,
  getPublicProjectInputSchema,
  getPublicProjectOutputSchema,
  getPublicProjectsOutputSchema,
  getSkillsOutputSchema,
  getSuperAdminProfileOutputSchema,
} from "@/lib/dto/visitor";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { achievementService } from "./achievement.service";
import { careerService } from "./career.service";
import { contactMethodService } from "./contact-method.service";
import { educationService } from "./education.service";
import { profileService } from "./profile.service";
import { projectService } from "./project.service";
import { skillService } from "./skill.service";

class VisitorService {
  public async getSuperAdminProfileInfo(ctx: RequestContext) {
    const profile = await profileService.getSuperAdmin(ctx, {
      assets: { asset: true },
    });
    const result = validateOutput(
      { ...profile, avatar: profile.featuredAsset },
      getSuperAdminProfileOutputSchema,
    );
    return result;
  }

  public async getFeaturedSkills(ctx: RequestContext) {
    const skills = await skillService.find(ctx, {
      take: 5,
      filter: { isFeatured: { equals: true } },
    });

    const result = validateOutput(skills, getFeaturedSkillsOutputSchema);
    return result;
  }
  public async getFeaturedProjects(ctx: RequestContext) {
    const projects = await projectService.find(ctx, {
      take: 5,
      filter: { featured: { equals: true }, enabled: { equals: true } },
      includeSoftDeleted: false,
    });

    const result = validateOutput(projects, getFeaturedProjectsOutputSchema);
    return result;
  }
  public async getFeaturedCareers(ctx: RequestContext) {
    const careers = await careerService.find(ctx, {
      take: 5,
      filter: { isFeatured: { equals: true } },
    });

    const result = validateOutput(careers, getFeaturedCareersOutputSchema);
    return result;
  }
  public async getSkills(ctx: RequestContext) {
    const skills = await skillService.find(ctx, {});

    const result = validateOutput(skills, getSkillsOutputSchema);
    return result;
  }
  public async getProjects(ctx: RequestContext) {
    const projects = await projectService.find(
      ctx,
      {
        filter: {
          enabled: { equals: true },
        },
        includeSoftDeleted: false,
      },
      { skills: true },
    );

    const result = validateOutput(projects, getPublicProjectsOutputSchema);
    return result;
  }
  public async getProject(
    ctx: RequestContext,
    input: GetPublicProjectInputSchema,
  ) {
    const parsedInput = validateInput(input, getPublicProjectInputSchema);
    const projects = await projectService.find(
      ctx,
      {
        take: 1,
        filter: {
          slug: { equals: parsedInput.slug },
          enabled: { equals: true },
        },
        includeSoftDeleted: false,
      },
      {
        skills: {
          featuredAsset: true,
        },
        career: {
          featuredAsset: true,
        },
        education: {
          featuredAsset: true,
        },
        achievements: {
          featuredAsset: true,
        },
      },
    );
    try {
      if (projects.items?.length) {
        const result = validateOutput(
          projects.items?.[0],
          getPublicProjectOutputSchema,
        );
        return result;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  public async getContactMethods(ctx: RequestContext) {
    const contactMethods = await contactMethodService.find(ctx, {
      filter: {
        enabled: { equals: true },
      },
    });

    const result = validateOutput(
      contactMethods,
      getPublicContactMethodsOutputSchema,
    );
    return result;
  }

  public async getAchievements(ctx: RequestContext) {
    const achievements = await achievementService.find(ctx, {});

    const result = validateOutput(
      achievements,
      getPublicAchievementsOutputSchema,
    );
    return result;
  }

  public async getCareer(ctx: RequestContext) {
    const career = await careerService.find(ctx, {});

    const result = validateOutput(career, getPublicCareerOutputSchema);
    return result;
  }

  public async getEducation(ctx: RequestContext) {
    const edu = await educationService.find(ctx, {});

    const result = validateOutput(edu, getPublicEducationOutputSchema);
    return result;
  }
}

export const visitorService = new VisitorService();
