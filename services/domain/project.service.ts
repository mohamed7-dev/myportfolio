import "server-only";
import { IsNull } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type { DeletionResponse, InputIdSchema } from "@/lib/dto/common";

import type {
  CreateProjectInputSchema,
  ProjectListInputSchema,
  SoftDeleteProjectsInputSchema,
  UpdateProjectInputSchema,
} from "@/lib/dto/project";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { Project } from "@/orm/entities/project/project.entity";
import { ProjectTranslation } from "@/orm/entities/project/project-translation.entity";
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
  public async findOne(ctx: RequestContext, input: InputIdSchema) {
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
      },
    });
    if (project) {
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
      };
    }
  }

  public async find(ctx: RequestContext, input: ProjectListInputSchema) {
    const qb = await listQueryBuilder.build(Project, input, {
      ctx,
      alias: "project",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
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
          const translatedProject = translator.translate(
            ctx.languageCode,
            project,
          );
          const translatedAssets = translatedProject.assets.map(
            (projectAsset) => {
              return {
                ...projectAsset,
                asset: translator.translate(
                  ctx.languageCode,
                  projectAsset.asset,
                ),
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
          };
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
}

export const projectService = new ProjectService();
