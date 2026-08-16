import type { RequestContext } from "@/api/request-context/request-context";
import type {
  CareerListInputSchema,
  CreateCareerInputSchema,
  DeleteCareersInputSchema,
  FindOneCareerInputSchema,
  UpdateCareerInputSchema,
} from "@/lib/dto/career";
import { Career } from "@/orm/entities/career/career.entity";
import {
  convertDate,
  listQueryBuilder,
} from "../helpers/list-query-builder.service";
import { translator } from "../helpers/translator.service";
import "server-only";
import type { FindOptionsRelations } from "typeorm";
import type { DeletionResponse } from "@/lib/dto/common";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { AppEntity } from "@/orm/entities/app-entity";
import { CareerTranslation } from "@/orm/entities/career/career.translation";
import { ormService } from "@/orm/orm.service";
import { slugValidator } from "../helpers/slug-validator.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { achievementService } from "./achievement.service";
import { assetService } from "./asset.service";

interface EntityWithCareer extends AppEntity {
  career: Career | null;
}

export interface EntityCareerInput {
  careerId?: string | null;
}

class CareerService {
  public async findOne(
    ctx: RequestContext,
    input: FindOneCareerInputSchema,
    relations?: FindOptionsRelations<Career>,
  ) {
    const repo = await ormService.getRepository(ctx, Career);
    const career = await repo.findOne({
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

    if (career) {
      return this.translateCareer(ctx, career);
    }
  }

  public async find(
    ctx: RequestContext,
    options: CareerListInputSchema,
    relations?: FindOptionsRelations<Career>,
  ) {
    const qb = await listQueryBuilder.build(Career, options, {
      ctx,
      alias: "career",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (options?.filter?.name) {
      const name = options.filter.name.contains;
      if (name) {
        qb.andWhere("career__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }

    if (options?.filter?.location) {
      const location = options.filter.location.contains;
      if (location) {
        qb.andWhere("career__translations.location LIKE :location", {
          location: `%${typeof location === "string" ? location.trim() : location}%`,
        });
      }
    }

    if (options?.filter?.organization) {
      const organization = options.filter.organization.contains;
      if (organization) {
        qb.andWhere("career__translations.organization LIKE :organization", {
          organization: `%${typeof organization === "string" ? organization.trim() : organization}%`,
        });
      }
    }

    if (options?.filter?.isPresent) {
      const isPresent = options.filter.isPresent.equals;
      if (isPresent !== undefined) {
        qb.andWhere("career.isPresent = :isPresent", {
          isPresent,
        });
      }
    }

    if (options?.filter?.startDate) {
      const startDate = options.filter.startDate.equals;
      if (startDate) {
        qb.andWhere("career.startDate = :startDate", {
          startDate: convertDate(startDate),
        });
      }
    }

    if (options?.filter?.endDate) {
      const endDate = options.filter.endDate.equals;
      if (endDate) {
        qb.andWhere("career.endDate = :endDate", {
          endDate: convertDate(endDate),
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((career) => {
          return this.translateCareer(ctx, career);
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(ctx: RequestContext, input: CreateCareerInputSchema) {
    await slugValidator.validateSlug(ctx, input, CareerTranslation);
    const career = await translatableSaver.create({
      ctx,
      input,
      entityType: Career,
      translationEntityType: CareerTranslation,
      beforeSave: async (career) => {
        await assetService.updateEntityFeaturedAsset(ctx, career, input);
        await achievementService.updateEntityAchievements(ctx, career, input);
      },
    });
    await assetService.updateEntityAssets(ctx, career, input);

    return await this.findOne(ctx, { id: career.id });
  }

  public async update(ctx: RequestContext, input: UpdateCareerInputSchema) {
    const repo = await ormService.getRepository(ctx, Career);
    const career = await repo.findOne({
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
    if (!career) {
      throw new EntityNotFoundError("Career not found");
    }

    await slugValidator.validateSlug(ctx, input, CareerTranslation);

    const updatedCareer = await translatableSaver.update({
      ctx,
      input,
      entityType: Career,
      translationEntityType: CareerTranslation,
      beforeSave: async (career) => {
        await assetService.updateEntityFeaturedAsset(ctx, career, input);
        await assetService.updateEntityAssets(ctx, career, input);
        await achievementService.updateEntityAchievements(ctx, career, input);
      },
    });

    return await this.findOne(ctx, { id: updatedCareer.id });
  }

  async delete(
    ctx: RequestContext,
    input: DeleteCareersInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Career);
    const careers = await Promise.all(
      input.ids.map(async (id) => {
        const career = await repo.findOne({
          where: {
            id,
          },
        });
        if (!career) {
          throw new EntityNotFoundError("Career not found");
        }
        return career;
      }),
    );

    return await Promise.all(
      careers.map(async (skill) => {
        await repo.remove(skill);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async updateEntityCareer<Entity extends EntityWithCareer>(
    ctx: RequestContext,
    entity: Entity,
    input: EntityCareerInput,
  ): Promise<Entity> {
    const { careerId } = input;
    if (careerId === null || careerId === undefined) {
      entity.career = null;
      return entity;
    }

    const career = await this.findOne(ctx, { id: careerId });
    if (career) {
      entity.career = career as any;
    }
    return entity;
  }

  private translateCareer(ctx: RequestContext, career: Career) {
    const translatedCareer = translator.translate(ctx.languageCode, career);
    const translatedAssets = translatedCareer.assets.flatMap((careerAsset) => {
      return {
        ...careerAsset,
        asset: translator.translate(ctx.languageCode, careerAsset.asset),
      };
    });

    return {
      ...translatedCareer,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedCareer.featuredAsset,
      ),
    };
  }
}

export const careerService = new CareerService();
