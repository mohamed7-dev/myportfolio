import "server-only";
import {
  Brackets,
  type FindOptionsRelations,
  type SelectQueryBuilder,
} from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { appConfig } from "@/lib/config/app-config";
import { DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE } from "@/lib/constants";
import { UserInputError } from "@/lib/errors/errors";
import type { ListQueryOptions } from "@/lib/types/list-query-options";
import type { ClassType } from "@/lib/types/shared-types";
import { isObject } from "@/lib/utils/data-type-checkers";
import type { AppEntity } from "@/orm/entities/app-entity";
import { ormService } from "@/orm/orm.service";
import { getEntityMetadata } from "@/orm/utils/get-entity-metadata";

interface ExtraOptions<Entity extends AppEntity> {
  ignoreQueryLimits?: boolean;
  alias?: string;
  relations?: FindOptionsRelations<Entity>;
  ctx?: RequestContext;
}

class ListQueryBuilder {
  public async build<Entity extends AppEntity>(
    entityType: ClassType<Entity>,
    options: ListQueryOptions = {},
    extraOptions: ExtraOptions<Entity> = {},
  ) {
    const { take, skip } = this.parsePaginationParams(
      options,
      extraOptions.ignoreQueryLimits ?? false,
    );

    const repo = await ormService.getRepository(extraOptions?.ctx, entityType);
    const alias = extraOptions?.alias
      ? extraOptions.alias
      : entityType.name.toLowerCase();

    const qb = repo.createQueryBuilder(alias);

    await this.applyTranslationConditions(
      entityType,
      qb,
      options?.filter ?? {},
      extraOptions.ctx,
    );

    qb.setFindOptions({
      relations: extraOptions.relations,
      take,
      skip,
      relationLoadStrategy: "query",
    });

    return qb;
  }

  private parsePaginationParams(
    options: ListQueryOptions,
    ignoreQueryLimits: boolean,
  ): {
    take: number;
    skip: number;
  } {
    let max = 0;

    if (ignoreQueryLimits) {
      max = Number.MAX_SAFE_INTEGER;
    } else {
      max = appConfig.listQueryLimit;
    }

    const takeOptionExists = isObject(options) && "take" in options;

    if (takeOptionExists && options.take && options.take > max) {
      throw new UserInputError(
        `Cannot take more than ${appConfig.listQueryLimit} results from a list query`,
      );
    }

    let take = max;

    if (takeOptionExists && options.take == null) {
      take = max;
    } else if (takeOptionExists && options.take) {
      // max -> 1000
      // take -> 10 *

      // max -> 1000 *
      // take -> 0

      // max -> 1000 *
      // take -> -10
      take = Math.min(max, Math.max(options.take, 0));
    }

    const skipOptionsExists = isObject(options) && "skip" in options;

    const skip = skipOptionsExists ? Math.max(options.skip ?? 0, 0) : 0;

    if (
      skipOptionsExists &&
      options.skip !== undefined &&
      takeOptionExists &&
      options.take === undefined
    ) {
      take = max;
    }
    return {
      skip,
      take,
    };
  }

  private async applyTranslationConditions<Entity extends AppEntity>(
    entityType: ClassType<Entity>,
    qb: SelectQueryBuilder<Entity>,
    filterParams: Record<string, any>,
    ctx?: RequestContext,
  ): Promise<void> {
    const languageCode = ctx?.languageCode ?? "en";

    const dataSource = await ormService.getDataSource();
    const { translationColumns } = getEntityMetadata(dataSource, entityType);
    const alias = qb.alias;

    let filteringOnTranslatableKey = false;

    const filterKeys = Object.keys(filterParams);
    for (const translationColumn of translationColumns) {
      if (filterKeys.includes(translationColumn.propertyName)) {
        filteringOnTranslatableKey = true;
      }
    }

    if (filteringOnTranslatableKey) {
      const translationsAlias = qb.dataSource.namingStrategy.joinTableName(
        alias,
        "translations",
        "",
        "",
      );
      qb.leftJoinAndSelect(`${alias}.translations`, translationsAlias);
      qb.andWhere(
        new Brackets((qb1) => {
          qb1.where(`${translationsAlias}.languageCode = :languageCode`, {
            languageCode,
          });
          const defaultLanguageCode = DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE;
          const translationEntity = translationColumns[0].entityMetadata.target;

          if (languageCode !== defaultLanguageCode) {
            qb1.orWhere(
              new Brackets((qb2) => {
                const subQb1 = dataSource
                  .createQueryBuilder(translationEntity, "translation")
                  .where(`translation.base = ${alias}.id`)
                  .andWhere("translation.languageCode = :defaultLanguageCode");
                const subQb2 = dataSource
                  .createQueryBuilder(translationEntity, "translation")
                  .where(`translation.base = ${alias}.id`)
                  .andWhere(
                    "translation.languageCode = :nonDefaultLanguageCode",
                  );

                qb2
                  .where(`EXISTS (${subQb1.getQuery()})`)
                  .andWhere(`NOT EXISTS (${subQb2.getQuery()})`);
              }),
            );
          } else {
            qb1.orWhere(
              new Brackets((qb2) => {
                const subQb1 = dataSource
                  .createQueryBuilder(translationEntity, "translation")
                  .where(`translation.base = ${alias}.id`)
                  .andWhere("translation.languageCode = :defaultLanguageCode");
                const subQb2 = dataSource
                  .createQueryBuilder(translationEntity, "translation")
                  .where(`translation.base = ${alias}.id`)
                  .andWhere("translation.languageCode != :defaultLanguageCode");

                qb2
                  .where(`NOT EXISTS (${subQb1.getQuery()})`)
                  .andWhere(`EXISTS (${subQb2.getQuery()})`);
              }),
            );
          }
          qb.setParameters({
            nonDefaultLanguageCode: languageCode,
            defaultLanguageCode,
          });
        }),
      );
    }
  }
}

export const listQueryBuilder = new ListQueryBuilder();
