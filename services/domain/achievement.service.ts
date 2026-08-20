import { type FindOptionsRelations, In } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type {
  AchievementListInputSchema,
  CreateAchievementInputSchema,
  DeleteAchievementsInputSchema,
  FindOneAchievementInputSchema,
  UpdateAchievementInputSchema,
} from "@/lib/dto/achievement";
import type { DeletionResponse } from "@/lib/dto/common";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { Translated } from "@/lib/types/translatable";
import { Achievement } from "@/orm/entities/achievement/achievement.entity";
import { AchievementTranslation } from "@/orm/entities/achievement/achievement-translation.entity";
import type { AppEntity } from "@/orm/entities/app-entity";
import type { Career } from "@/orm/entities/career/career.entity";
import { ormService } from "@/orm/orm.service";
import { achievementsSeed } from "@/orm/seed/achievements";
import type { SeededAssetGroup } from "@/orm/seed/seed-asset";
import { listQueryBuilder } from "../helpers/list-query-builder/list-query-builder.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { assetService } from "./asset.service";

export interface EntityWithAchievement extends AppEntity {
  achievements: Achievement[];
}

export interface EntityAchievementInput {
  achievementIds?: string[] | null;
}

class AchievementService {
  /**@internal */
  public async seedAchievements(
    ctx: RequestContext,
    assets: Map<string, SeededAssetGroup>,
  ): Promise<Map<string, string>> {
    const achievementIds = new Map<string, string>();

    await Promise.all(
      achievementsSeed.map(async (achievement) => {
        const assetGroup = assets.get(achievement.key);
        if (assetGroup?.featuredAsset.id) {
          const savedAchievement = await achievementService.create(ctx, {
            ...achievement,
            featuredAssetId: assetGroup?.featuredAsset.id,
            assetIds: assetGroup.assets.map((item) => item.id),
          });
          achievementIds.set(achievement.key, savedAchievement?.id ?? "");
        }
      }),
    );

    return achievementIds;
  }

  public async findOne(
    ctx: RequestContext,
    input: FindOneAchievementInputSchema,
    relations?: FindOptionsRelations<Achievement>,
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
        ...relations,
      },
    });

    if (achievement) {
      return this.translateAchievement(ctx, achievement);
    }
  }

  public async find(
    ctx: RequestContext,
    options: AchievementListInputSchema,
    relations?: FindOptionsRelations<Achievement>,
  ) {
    const qb = await listQueryBuilder.build(Achievement, options, {
      ctx,
      alias: "achievement",
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
        items: result[0].flatMap((achievement) => {
          return this.translateAchievement(ctx, achievement);
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

  private translateAchievement(ctx: RequestContext, achievement: Achievement) {
    const translatedAchievement = translator.translate(
      ctx.languageCode,
      achievement,
    );
    const translatedAssets = translatedAchievement.assets.flatMap(
      (achievementAsset) => {
        return {
          ...achievementAsset,
          asset: translator.translate(ctx.languageCode, achievementAsset.asset),
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
      ...(achievement.career && {
        career: translator.translate<any>(ctx.languageCode, {
          ...achievement.career,
          featuredAsset: translator.translate(
            ctx.languageCode,
            achievement.career.featuredAsset,
          ),
        }) as Translated<Career>,
      }),
    };
  }
}

export const achievementService = new AchievementService();
