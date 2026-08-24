import { type FindOptionsRelations, IsNull, Not } from "typeorm";
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
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import type { Achievement } from "@/orm/entities/achievement/achievement.entity";
import type { Career } from "@/orm/entities/career/career.entity";
import type { Education } from "@/orm/entities/education/education.entity";
import { Project } from "@/orm/entities/project/project.entity";
import { ProjectTranslation } from "@/orm/entities/project/project-translation.entity";
import type { Skill } from "@/orm/entities/skill/skill.entity";
import { ormService } from "@/orm/orm.service";
import { projectsSeed } from "@/orm/seed/projects";
import type { SeededAssetGroup } from "@/orm/seed/seed-asset";
import { listQueryBuilder } from "../helpers/list-query-builder/list-query-builder.service";
import { slugValidator } from "../helpers/slug-validator.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { achievementService } from "./achievement.service";
import { assetService } from "./asset.service";
import { careerService } from "./career.service";
import { educationService } from "./education.service";
import { skillService } from "./skill.service";

class ProjectService {
  /**@internal */
  public async seedProjects(
    ctx: RequestContext,
    projectAssetsMap: Map<string, SeededAssetGroup>,
    skillIds: Map<string, string>,
    careerIds: Map<string, string>,
    educationIds: Map<string, string>,
    achievementIds: Map<string, string>,
  ) {
    const projectIds = new Map<string, string>();

    await Promise.all(
      projectsSeed.map(
        async ({
          skillKeys,
          careerKey,
          educationKey,
          achievementKeys,
          ...project
        }) => {
          const assetGroup = projectAssetsMap.get(project.key);
          if (assetGroup?.featuredAsset.id) {
            const savedProject = await projectService.create(ctx, {
              ...project,
              featuredAssetId: assetGroup?.featuredAsset.id,
              assetIds: assetGroup.assets.map((item) => item.id),
              skillIds: skillKeys
                .map((key) => skillIds.get(key))
                .filter(notNullOrUndefined),
              careerId: careerKey ? careerIds?.get(careerKey) : undefined,
              educationItemId: educationKey
                ? educationIds?.get(educationKey)
                : undefined,
              achievementIds: achievementKeys
                ?.map((key) => achievementIds.get(key))
                .filter(notNullOrUndefined),
            });
            projectIds.set(project.key, savedProject?.id ?? "");
          }
        },
      ),
    );

    return projectIds;
  }

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
      where: {
        ...(!input.includeSoftDeleted && { deletedAt: IsNull() }),
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

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
    return await this.findOne(
      ctx,
      { id: project.id },
      {
        skills: {
          featuredAsset: true,
        },
      },
    );
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

    return await this.findOne(
      ctx,
      { id: updatedProject.id },
      { skills: { featuredAsset: true } },
    );
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
