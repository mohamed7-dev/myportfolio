import "server-only";
import type { RequestContext } from "@/api/request-context/request-context";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { translator } from "../helpers/translator.service";
import "server-only";
import { In } from "typeorm";
import type {
  AchievementListInputSchema,
  CreateAchievementInputSchema,
  DeleteAchievementsInputSchema,
  FindOneAchievementInputSchema,
  UpdateAchievementInputSchema,
} from "@/lib/dto/achievement";
import type { DeletionResponse } from "@/lib/dto/common";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { Achievement } from "@/orm/entities/achievement/achievement.entity";
import { AchievementTranslation } from "@/orm/entities/achievement/achievement-translation.entity";
import type { AppEntity } from "@/orm/entities/app-entity";
import { ormService } from "@/orm/orm.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { assetService } from "./asset.service";

export interface EntityWithAchievement extends AppEntity {
  achievements: Achievement[];
}

export interface EntityAchievementInput {
  achievementIds?: string[] | null;
}

class AchievementService {
  public async findOne(
    ctx: RequestContext,
    input: FindOneAchievementInputSchema,
  ) {
    const repo = await ormService.getRepository(ctx, Achievement);
    const achievement = await repo.findOne({
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

    if (achievement) {
      const translatedAchievement = translator.translate(
        ctx.languageCode,
        achievement,
      );
      const translatedAssets = translatedAchievement.assets.flatMap(
        (achievementAsset) => {
          return {
            ...achievementAsset,
            asset: translator.translate(
              ctx.languageCode,
              achievementAsset.asset,
            ),
          };
        },
      );

      return {
        ...translatedAchievement,
        assets: translatedAssets,
        featuredAsset: translator.translate(
          ctx.languageCode,
          translatedAchievement.featuredAsset,
        ),
      };
    }
  }

  public async find(ctx: RequestContext, options: AchievementListInputSchema) {
    const qb = await listQueryBuilder.build(Achievement, options, {
      ctx,
      alias: "achievement",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });

    if (options?.filter?.name) {
      const name = options.filter.name.contains;
      if (name) {
        qb.andWhere("achievement__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((achievement) => {
          const translatedAchievement = translator.translate(
            ctx.languageCode,
            achievement,
          );
          const translatedAssets = translatedAchievement.assets.map(
            (achievementAsset) => {
              return {
                ...achievementAsset,
                asset: translator.translate(
                  ctx.languageCode,
                  achievementAsset.asset,
                ),
              };
            },
          );

          return {
            ...translatedAchievement,
            assets: translatedAssets,
            featuredAsset: translator.translate(
              ctx.languageCode,
              translatedAchievement.featuredAsset,
            ),
          };
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(
    ctx: RequestContext,
    input: CreateAchievementInputSchema,
  ) {
    const achievement = await translatableSaver.create({
      ctx,
      input,
      entityType: Achievement,
      translationEntityType: AchievementTranslation,
      beforeSave: async (achievement) => {
        await assetService.updateEntityFeaturedAsset(ctx, achievement, input);
      },
    });
    await assetService.updateEntityAssets(ctx, achievement, input);

    return await this.findOne(ctx, { id: achievement.id });
  }

  public async update(
    ctx: RequestContext,
    input: UpdateAchievementInputSchema,
  ) {
    const repo = await ormService.getRepository(ctx, Achievement);
    const achievement = await repo.findOne({
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
    if (!achievement) {
      throw new EntityNotFoundError("Achievement not found");
    }

    const updatedAchievement = await translatableSaver.update({
      ctx,
      input,
      entityType: Achievement,
      translationEntityType: AchievementTranslation,
      beforeSave: async (achievement) => {
        await assetService.updateEntityFeaturedAsset(ctx, achievement, input);
        await assetService.updateEntityAssets(ctx, achievement, input);
      },
    });

    return await this.findOne(ctx, { id: updatedAchievement.id });
  }

  async delete(
    ctx: RequestContext,
    input: DeleteAchievementsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Achievement);
    const achievements = await Promise.all(
      input.ids.map(async (id) => {
        const achievement = await repo.findOne({
          where: {
            id,
          },
        });
        if (!achievement) {
          throw new EntityNotFoundError("Achievement not found");
        }
        return achievement;
      }),
    );

    return await Promise.all(
      achievements.map(async (achievement) => {
        await repo.remove(achievement);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async updateEntityAchievements<Entity extends EntityWithAchievement>(
    ctx: RequestContext,
    entity: Entity,
    input: EntityAchievementInput,
  ) {
    const { achievementIds } = input;
    const repo = await ormService.getRepository(ctx, Achievement);
    if (achievementIds?.length) {
      const achievements = await repo.find({
        where: {
          id: In(achievementIds),
        },
      });
      entity.achievements = achievements;
    } else {
      entity.achievements = [];
    }

    return entity;
  }
}

export const achievementService = new AchievementService();
