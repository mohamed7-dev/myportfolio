import "server-only";
import { getCurrentLocale } from "@/i18n/server";
import type { PaginatedListInputSchema } from "@/lib/dto/paginated-list";
import type { CreateProjectInputSchema } from "@/lib/dto/project";
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
    async projects(options: PaginatedListInputSchema) {
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

async function _projects(options: PaginatedListInputSchema) {
  const currentLanguageCode = await getCurrentLocale();
  return (
    await listQueryBuilder().build(Project, options, {
      relations: {
        assets: true,
        featuredAsset: true,
      },
    })
  )
    .getManyAndCount()
    .then((result) => {
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
