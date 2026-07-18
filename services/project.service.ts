import "server-only";
import { IsNull } from "typeorm";
import { getCurrentLocale } from "@/i18n/server";
import type { DeletionResponse } from "@/lib/dto/common";
import type {
  PaginatedListInputSchema,
  PaginatedSoftDeletableListInputSchema,
} from "@/lib/dto/paginated-list";
import type {
  CreateProjectInputSchema,
  DeleteProjectsInputSchema,
  UpdateProjectInputSchema,
} from "@/lib/dto/project";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { Project } from "@/orm/entities/project/project.entity";
import { ProjectTranslation } from "@/orm/entities/project/project-translation.entity";
import { ormService } from "@/orm/orm.service";
import { assetService } from "./asset.service";
import { listQueryBuilder } from "./list-query-builder.service";
import { slugValidator } from "./slug-validator.service";
import { translatableSaver } from "./translatable-saver/translatable-saver.service";
import { translator } from "./translator.service";

export function projectService() {
  return {
    async create(input: CreateProjectInputSchema) {
      return await _createProject(input);
    },
    async update(input: UpdateProjectInputSchema) {
      return await _updateProject(input);
    },
    async softDeleteProjects(input: DeleteProjectsInputSchema) {
      return await _softDelete(input);
    },
    async delete(id: string) {
      return await _delete(id);
    },
    async projects(options: PaginatedSoftDeletableListInputSchema) {
      return await _projects(options);
    },
    async project(id: string) {
      return await _project(id);
    },
  };
}

async function _createProject(input: CreateProjectInputSchema) {
  // 1. validate slug
  await slugValidator().validateSlug(input, ProjectTranslation);
  // 2. create project
  const project = await translatableSaver().create({
    input,
    entityType: Project,
    translationEntityType: ProjectTranslation,
    beforeSave: async (p) => {
      await assetService().updateEntityFeaturedAsset(p, input);
    },
  });
  // 3. create entity assets
  await assetService().updateEntityAssets(project, input);

  return project;
}

async function _updateProject(input: UpdateProjectInputSchema) {
  const repo = await ormService.getRepository(Project);
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

  await slugValidator().validateSlug(input, ProjectTranslation);

  const updatedProject = await translatableSaver().update({
    input,
    entityType: Project,
    translationEntityType: ProjectTranslation,
    beforeSave: async (p) => {
      await assetService().updateEntityFeaturedAsset(p, input);
      await assetService().updateEntityAssets(p, input);
    },
  });

  return await _project(updatedProject.id);
}

async function _softDelete(
  input: DeleteProjectsInputSchema,
): Promise<DeletionResponse[]> {
  const repo = await ormService.getRepository(Project);
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

async function _delete(id: string): Promise<DeletionResponse> {
  const repo = await ormService.getRepository(Project);
  const project = await repo.findOne({
    where: {
      id,
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

async function _projects(options: PaginatedSoftDeletableListInputSchema) {
  const currentLanguageCode = await getCurrentLocale();
  const qb = await listQueryBuilder().build(Project, options, {
    alias: "project",
    relations: {
      assets: {
        asset: true,
      },
      featuredAsset: true,
    },
  });

  if (!options.includeSoftDeleted) {
    qb.andWhere("project.deletedAt IS NULL");
  }

  return await qb.getManyAndCount().then((result) => {
    return {
      items: result[0].flatMap((project) => {
        const translatedProject = translator().translate(
          currentLanguageCode,
          project,
        );
        const translatedAssets = translatedProject.assets.map(
          (projectAsset) => {
            return {
              ...projectAsset,
              asset: translator().translate(
                currentLanguageCode,
                projectAsset.asset,
              ),
            };
          },
        );

        return {
          ...translatedProject,
          assets: translatedAssets,
          featuredAsset: translator().translate(
            currentLanguageCode,
            translatedProject.featuredAsset,
          ),
        };
      }),
      itemsCount: result[1],
    };
  });
}

async function _project(id: string) {
  const currentLanguageCode = await getCurrentLocale();
  const repo = await ormService.getRepository(Project);
  const project = await repo.findOne({
    where: {
      id: id,
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
    const translatedProject = translator().translate(
      currentLanguageCode,
      project,
    );
    const translatedAssets = translatedProject.assets.flatMap(
      (projectAsset) => {
        return {
          ...projectAsset,
          asset: translator().translate(
            currentLanguageCode,
            projectAsset.asset,
          ),
        };
      },
    );

    return {
      ...translatedProject,
      assets: translatedAssets,
      featuredAsset: translator().translate(
        currentLanguageCode,
        translatedProject.featuredAsset,
      ),
    };
  }
}
