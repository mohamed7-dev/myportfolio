import type { FindOptionsRelations } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type { DeletionResponse } from "@/lib/dto/common";
import type {
  CreateEducationInputSchema,
  DeleteEducationsInputSchema,
  EducationListInputSchema,
  FindOneEducationInputSchema,
  UpdateEducationInputSchema,
} from "@/lib/dto/education";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { AppEntity } from "@/orm/entities/app-entity";
import { Education } from "@/orm/entities/education/education.entity";
import { EducationTranslation } from "@/orm/entities/education/education-translation.entity";
import { ormService } from "@/orm/orm.service";
import { educationSeed } from "@/orm/seed/education";
import type { SeededAssetGroup } from "@/orm/seed/seed-asset";
import {
  convertDate,
  listQueryBuilder,
} from "../helpers/list-query-builder.service";
import { slugValidator } from "../helpers/slug-validator.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { assetService } from "./asset.service";

interface EntityWithEducation extends AppEntity {
  education: Education | null;
}

export interface EntityEducationInput {
  educationId?: string | null;
}

class EducationService {
  /**@internal */
  public async seedEducation(
    ctx: RequestContext,
    assets: Map<string, SeededAssetGroup>,
  ): Promise<Map<string, string>> {
    const educationIds = new Map<string, string>();

    await Promise.all(
      educationSeed.map(async (edu) => {
        const assetGroup = assets.get(edu.key);
        if (assetGroup?.featuredAsset.id) {
          const savedEdu = await educationService.create(ctx, {
            ...edu,
            featuredAssetId: assetGroup?.featuredAsset.id,
            assetIds: assetGroup.assets.map((item) => item.id),
          });
          educationIds.set(edu.key, savedEdu?.id ?? "");
        }
      }),
    );

    return educationIds;
  }

  public async findOne(
    ctx: RequestContext,
    input: FindOneEducationInputSchema,
    relations?: FindOptionsRelations<Education>,
  ) {
    const repo = await ormService.getRepository(ctx, Education);
    const education = await repo.findOne({
      where: {
        id: input.id,
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (education) {
      return this.translateEducation(ctx, education);
    }
  }

  public async find(
    ctx: RequestContext,
    options: EducationListInputSchema,
    relations?: FindOptionsRelations<Education>,
  ) {
    const qb = await listQueryBuilder.build(Education, options, {
      ctx,
      alias: "edu",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (options?.filter?.school) {
      const school = options.filter.school.contains;
      if (school) {
        qb.andWhere("edu__translations.school LIKE :school", {
          school: `%${typeof school === "string" ? school.trim() : school}%`,
        });
      }
    }

    if (options?.filter?.location) {
      const location = options.filter.location.contains;
      if (location) {
        qb.andWhere("edu__translations.location LIKE :location", {
          location: `%${typeof location === "string" ? location.trim() : location}%`,
        });
      }
    }

    if (options?.filter?.degree) {
      const degree = options.filter.degree.contains;
      if (degree) {
        qb.andWhere("edu__translations.organization LIKE :degree", {
          degree: `%${typeof degree === "string" ? degree.trim() : degree}%`,
        });
      }
    }

    if (options?.filter?.isPresent) {
      const isPresent = options.filter.isPresent.equals;
      if (isPresent !== undefined) {
        qb.andWhere("edu.isPresent = :isPresent", {
          isPresent,
        });
      }
    }

    if (options?.filter?.startDate) {
      const startDate = options.filter.startDate.equals;
      if (startDate) {
        qb.andWhere("edu.startDate = :startDate", {
          startDate: convertDate(startDate),
        });
      }
    }

    if (options?.filter?.endDate) {
      const endDate = options.filter.endDate.equals;
      if (endDate) {
        qb.andWhere("edu.endDate = :endDate", {
          endDate: convertDate(endDate),
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((edu) => {
          return this.translateEducation(ctx, edu);
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(ctx: RequestContext, input: CreateEducationInputSchema) {
    await slugValidator.validateSlug(ctx, input, EducationTranslation);
    const edu = await translatableSaver.create({
      ctx,
      input,
      entityType: Education,
      translationEntityType: EducationTranslation,
      beforeSave: async (edu) => {
        await assetService.updateEntityFeaturedAsset(ctx, edu, input);
      },
    });
    await assetService.updateEntityAssets(ctx, edu, input);

    return await this.findOne(ctx, { id: edu.id });
  }

  public async update(ctx: RequestContext, input: UpdateEducationInputSchema) {
    const repo = await ormService.getRepository(ctx, Education);
    const edu = await repo.findOne({
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
    if (!edu) {
      throw new EntityNotFoundError("Education item not found");
    }

    await slugValidator.validateSlug(ctx, input, EducationTranslation);

    const updatedEdu = await translatableSaver.update({
      ctx,
      input,
      entityType: Education,
      translationEntityType: EducationTranslation,
      beforeSave: async (edu) => {
        await assetService.updateEntityFeaturedAsset(ctx, edu, input);
        await assetService.updateEntityAssets(ctx, edu, input);
      },
    });

    return await this.findOne(ctx, { id: updatedEdu.id });
  }

  async delete(
    ctx: RequestContext,
    input: DeleteEducationsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Education);
    const eduItems = await Promise.all(
      input.ids.map(async (id) => {
        const edu = await repo.findOne({
          where: {
            id,
          },
        });
        if (!edu) {
          throw new EntityNotFoundError("Education item not found");
        }
        return edu;
      }),
    );

    return await Promise.all(
      eduItems.map(async (skill) => {
        await repo.remove(skill);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async updateEntityEducation<Entity extends EntityWithEducation>(
    ctx: RequestContext,
    entity: Entity,
    input: EntityEducationInput,
  ): Promise<Entity> {
    const { educationId } = input;
    if (educationId === null || educationId === undefined) {
      entity.education = null;
      return entity;
    }

    const education = await this.findOne(ctx, { id: educationId });
    if (education) {
      entity.education = education as any;
    }
    return entity;
  }

  private translateEducation(ctx: RequestContext, education: Education) {
    const translatedEdu = translator.translate(ctx.languageCode, education);
    const translatedAssets = translatedEdu.assets.flatMap((eduAsset) => {
      return {
        ...eduAsset,
        asset: translator.translate(ctx.languageCode, eduAsset.asset),
      };
    });

    return {
      ...translatedEdu,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedEdu.featuredAsset,
      ),
    };
  }
}

export const educationService = new EducationService();
