import type { RequestContext } from "@/api/request-context/request-context";
import {
  getFeaturedProjectsOutputSchema,
  getFeaturedSkillsOutputSchema,
  getSkillsOutputSchema,
  getSuperAdminProfileOutputSchema,
} from "@/lib/dto/visitor";
import { validateOutput } from "@/lib/helpers/validate-output";
import { profileService } from "./profile.service";
import "server-only";
import { projectService } from "./project.service";
import { skillService } from "./skill.service";

class VisitorService {
  public async getSuperAdminProfileInfo(ctx: RequestContext) {
    const profile = await profileService.getSuperAdmin(ctx);
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
    });

    const result = validateOutput(projects, getFeaturedProjectsOutputSchema);
    return result;
  }
  public async getSkills(ctx: RequestContext) {
    const skills = await skillService.find(ctx, {});

    const result = validateOutput(skills, getSkillsOutputSchema);
    return result;
  }
}

export const visitorService = new VisitorService();
