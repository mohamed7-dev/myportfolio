import "server-only";
import { type FindOptionsRelations, IsNull } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type { DeletionResponse, InputIdSchema } from "@/lib/dto/common";

import type {
  CreateProjectInputSchema,
  ProjectListInputSchema,
  SoftDeleteProjectsInputSchema,
  UpdateProjectInputSchema,
} from "@/lib/dto/project";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { Translated } from "@/lib/types/translatable";
import type { Achievement } from "@/orm/entities/achievement/achievement.entity";
import type { Career } from "@/orm/entities/career/career.entity";
import type { Education } from "@/orm/entities/education/education.entity";
import { Project } from "@/orm/entities/project/project.entity";
import { ProjectTranslation } from "@/orm/entities/project/project-translation.entity";
import type { Skill } from "@/orm/entities/skill/skill.entity";
import { ormService } from "@/orm/orm.service";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { slugValidator } from "../helpers/slug-validator.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { achievementService } from "./achievement.service";
import { assetService } from "./asset.service";
import { careerService } from "./career.service";
import { educationService } from "./education.service";
import { skillService } from "./skill.service";

class ProjectService {
  public async findOne(
    ctx: RequestContext,
    input: InputIdSchema,
    relations?: FindOptionsRelations<Project>,
  ) {
    const repo = await ormService.getRepository(ctx, Project);
    const project = await repo.findOne({
      where: {
        id: input.id,
        deletedAt: IsNull(),
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (project) {
      return this.translateProject(ctx, project);
    }
  }

  public async find(
    ctx: RequestContext,
    input: ProjectListInputSchema,
    relations?: FindOptionsRelations<Project>,
  ) {
    const qb = await listQueryBuilder.build(Project, input, {
      ctx,
      alias: "project",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (!input.includeSoftDeleted) {
      qb.andWhere("project.deletedAt IS NULL");
    }

    if (input?.filter?.name) {
      const name = input.filter.name.contains;
      if (name) {
        qb.andWhere("project__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }

    if (input?.filter?.slug) {
      const slug = input.filter.slug.equals;
      if (slug) {
        qb.andWhere("project__translations.slug = :slug", {
          slug: `${typeof slug === "string" ? slug.trim() : slug}`,
        });
      }
    }

    if (input?.filter?.enabled !== undefined) {
      const enabled = input.filter.enabled.equals;
      qb.andWhere("project.enabled = :enabled", {
        enabled: enabled,
      });
    }

    if (input?.filter?.featured !== undefined) {
      const featured = input.filter.featured.equals;
      qb.andWhere("project.featured = :featured", {
        featured: featured,
      });
    }

    if (input?.filter?.liveDemoUrl) {
      const liveDemoUrl = input.filter.liveDemoUrl.contains;
      if (liveDemoUrl) {
        qb.andWhere("project.liveDemoUrl LIKE :liveDemoUrl", {
          liveDemoUrl: `%${typeof liveDemoUrl === "string" ? liveDemoUrl.trim() : liveDemoUrl}%`,
        });
      }
    }

    if (input?.filter?.repoUrl) {
      const repoUrl = input.filter.repoUrl.contains;
      if (repoUrl) {
        qb.andWhere("project.repoUrl LIKE :repoUrl", {
          repoUrl: `%${typeof repoUrl === "string" ? repoUrl.trim() : repoUrl}%`,
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((project) => {
          return this.translateProject(ctx, project);
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(ctx: RequestContext, input: CreateProjectInputSchema) {
    // 1. validate slug
    await slugValidator.validateSlug(ctx, input, ProjectTranslation);
    // 2. create project
    const project = await translatableSaver.create({
      ctx,
      input,
      entityType: Project,
      translationEntityType: ProjectTranslation,
      beforeSave: async (p) => {
        await assetService.updateEntityFeaturedAsset(ctx, p, input);
        await careerService.updateEntityCareer(ctx, p, input);
        await achievementService.updateEntityAchievements(ctx, p, input);
        await skillService.updateEntitySkills(ctx, p, input);
        await educationService.updateEntityEducation(ctx, p, {
          ...input,
          educationId: input.educationItemId,
        });
      },
    });
    // 3. create entity assets
    await assetService.updateEntityAssets(ctx, project, input);

    return await this.findOne(ctx, { id: project.id });
  }

  public async update(ctx: RequestContext, input: UpdateProjectInputSchema) {
    const repo = await ormService.getRepository(ctx, Project);
    const project = await repo.findOne({
      where: {
        id: input.id,
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });
    if (!project) {
      throw new EntityNotFoundError("Project not found");
    }

    await slugValidator.validateSlug(ctx, input, ProjectTranslation);

    const updatedProject = await translatableSaver.update({
      ctx,
      input,
      entityType: Project,
      translationEntityType: ProjectTranslation,
      beforeSave: async (p) => {
        await assetService.updateEntityFeaturedAsset(ctx, p, input);
        await assetService.updateEntityAssets(ctx, p, input);
        await careerService.updateEntityCareer(ctx, p, input);
        await achievementService.updateEntityAchievements(ctx, p, input);
        await skillService.updateEntitySkills(ctx, p, input);
        await educationService.updateEntityEducation(ctx, p, {
          ...input,
          educationId: input.educationItemId,
        });
      },
    });

    return await this.findOne(ctx, { id: updatedProject.id });
  }

  public async softDelete(
    ctx: RequestContext,
    input: SoftDeleteProjectsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Project);
    const projects = await Promise.all(
      input.ids.map(async (id) => {
        const project = await repo.findOne({
          where: {
            id,
          },
        });
        if (!project) {
          throw new EntityNotFoundError("Project not found");
        }
        return project;
      }),
    );

    return await Promise.all(
      projects.map(async (project) => {
        project.deletedAt = new Date();
        await repo.save(project);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async delete(
    ctx: RequestContext,
    input: InputIdSchema,
  ): Promise<DeletionResponse> {
    const repo = await ormService.getRepository(ctx, Project);
    const project = await repo.findOne({
      where: {
        id: input.id,
      },
    });
    if (!project) {
      throw new EntityNotFoundError("Project not found");
    }

    await repo.remove(project);

    return {
      result: "DELETED",
      message: "",
    };
  }

  private translateProject(ctx: RequestContext, project: Project) {
    const translatedProject = translator.translate(ctx.languageCode, project);
    const translatedAssets = translatedProject.assets.flatMap(
      (projectAsset) => {
        return {
          ...projectAsset,
          asset: translator.translate(ctx.languageCode, projectAsset.asset),
        };
      },
    );

    return {
      ...translatedProject,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedProject.featuredAsset,
      ),
      ...(project.skills?.length && {
        skills: project.skills.map((skill) =>
          translator.translate<any>(ctx.languageCode, {
            ...skill,
            featuredAsset: translator.translate(
              ctx.languageCode,
              skill.featuredAsset,
            ),
          }),
        ) as Translated<Skill>[],
      }),
      ...(project.achievements?.length && {
        achievements: project.achievements.map((achievement) =>
          translator.translate<any>(ctx.languageCode, {
            ...achievement,
            featuredAsset: translator.translate(
              ctx.languageCode,
              achievement.featuredAsset,
            ),
          }),
        ) as Translated<Achievement>[],
      }),
      ...(project.career && {
        career: translator.translate<any>(ctx.languageCode, {
          ...project.career,
          ...(project.career?.featuredAsset && {
            featuredAsset: translator.translate(
              ctx.languageCode,
              project.career?.featuredAsset,
            ),
          }),
        }) as Translated<Career>,
      }),
      ...(project.education && {
        education: translator.translate<any>(ctx.languageCode, {
          ...project.education,
          ...(project.education?.featuredAsset && {
            featuredAsset: translator.translate(
              ctx.languageCode,
              project.education.featuredAsset,
            ),
          }),
        }) as Translated<Education>,
      }),
    };
  }
}

export const projectService = new ProjectService();
