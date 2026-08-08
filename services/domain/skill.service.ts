import type {
  CreateSkillInputSchema,
  DeleteSkillsInputSchema,
  SkillListInputSchema,
  UpdateSkillInputSchema,
} from "@/lib/dto/skill";
import "server-only";
import { In } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type { DeletionResponse, InputIdSchema } from "@/lib/dto/common";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { AppEntity } from "@/orm/entities/app-entity";
import { Skill } from "@/orm/entities/skill/skill.entity";
import { SkillTranslation } from "@/orm/entities/skill/skill-translation.entity";
import { ormService } from "@/orm/orm.service";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { slugValidator } from "../helpers/slug-validator.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { assetService } from "./asset.service";

export interface EntityWithSkill extends AppEntity {
  skills: Skill[];
}

export interface EntitySkillInput {
  skillIds?: string[] | null;
}

export class SkillService {
  async findOne(ctx: RequestContext, input: InputIdSchema) {
    const repo = await ormService.getRepository(ctx, Skill);
    const skill = await repo.findOne({
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

    if (skill) {
      const translatedSkill = translator.translate(ctx.languageCode, skill);
      const translatedAssets = translatedSkill.assets.flatMap((skillAsset) => {
        return {
          ...skillAsset,
          asset: translator.translate(ctx.languageCode, skillAsset.asset),
        };
      });

      return {
        ...translatedSkill,
        assets: translatedAssets,
        featuredAsset: translator.translate(
          ctx.languageCode,
          translatedSkill.featuredAsset,
        ),
      };
    }
  }

  async find(ctx: RequestContext, options: SkillListInputSchema) {
    const qb = await listQueryBuilder.build(Skill, options, {
      ctx,
      alias: "skill",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });

    if (options?.filter?.category) {
      const category = options.filter.category.equals;
      if (category) {
        qb.andWhere("skill.category = :category", {
          category: category,
        });
      }
    }
    if (options?.filter?.isFeatured !== undefined) {
      const isFeatured = options.filter.isFeatured.equals;
      qb.andWhere("skill.isFeatured = :isFeatured", {
        isFeatured: isFeatured,
      });
    }
    if (options?.filter?.name) {
      const name = options.filter.name.contains;
      if (name) {
        qb.andWhere("skill__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((project) => {
          const translatedSkill = translator.translate(
            ctx.languageCode,
            project,
          );
          const translatedAssets = translatedSkill.assets.map((skillAsset) => {
            return {
              ...skillAsset,
              asset: translator.translate(ctx.languageCode, skillAsset.asset),
            };
          });

          return {
            ...translatedSkill,
            assets: translatedAssets,
            featuredAsset: translator.translate(
              ctx.languageCode,
              translatedSkill.featuredAsset,
            ),
          };
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(ctx: RequestContext, input: CreateSkillInputSchema) {
    await slugValidator.validateSlug(ctx, input, SkillTranslation);
    const skill = await translatableSaver.create({
      ctx,
      input,
      entityType: Skill,
      translationEntityType: SkillTranslation,
      beforeSave: async (skill) => {
        await assetService.updateEntityFeaturedAsset(ctx, skill, input);
      },
    });
    await assetService.updateEntityAssets(ctx, skill, input);

    return await this.findOne(ctx, { id: skill.id });
  }

  public async update(ctx: RequestContext, input: UpdateSkillInputSchema) {
    const repo = await ormService.getRepository(ctx, Skill);
    const skill = await repo.findOne({
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
    if (!skill) {
      throw new EntityNotFoundError("Skill not found");
    }

    await slugValidator.validateSlug(ctx, input, SkillTranslation);

    const updatedSkill = await translatableSaver.update({
      ctx,
      input,
      entityType: Skill,
      translationEntityType: SkillTranslation,
      beforeSave: async (p) => {
        await assetService.updateEntityFeaturedAsset(ctx, p, input);
        await assetService.updateEntityAssets(ctx, p, input);
      },
    });

    return await this.findOne(ctx, { id: updatedSkill.id });
  }

  async delete(
    ctx: RequestContext,
    input: DeleteSkillsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Skill);
    const skills = await Promise.all(
      input.ids.map(async (id) => {
        const skill = await repo.findOne({
          where: {
            id,
          },
        });
        if (!skill) {
          throw new EntityNotFoundError("Skill not found");
        }
        return skill;
      }),
    );

    return await Promise.all(
      skills.map(async (skill) => {
        await repo.remove(skill);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async updateEntitySkills<Entity extends EntityWithSkill>(
    ctx: RequestContext,
    entity: Entity,
    input: EntitySkillInput,
  ) {
    const { skillIds } = input;
    const repo = await ormService.getRepository(ctx, Skill);
    if (skillIds?.length) {
      const skills = await repo.find({
        where: {
          id: In(skillIds),
        },
      });
      entity.skills = skills;
    } else {
      entity.skills = [];
    }

    return entity;
  }
}

export const skillService = new SkillService();
