import type { FindOptionsRelations } from "typeorm";
import { appConfig } from "@/lib/config/app-config";
import { UserInputError } from "@/lib/errors/errors";
import type { ListQueryOptions } from "@/lib/types/list-query-options";
import type { ClassType } from "@/lib/types/shared-types";
import { isObject } from "@/lib/utils/data-type-checkers";
import type { AppEntity } from "@/orm/entities/app-entity";
import { ormService } from "@/orm/orm.service";

interface ExtraOptions<Entity extends AppEntity> {
  ignoreQueryLimits?: boolean;
  alias?: string;
  relations?: FindOptionsRelations<Entity>;
}

export function listQueryBuilder() {
  return {
    async build<Entity extends AppEntity>(
      entityType: ClassType<Entity>,
      options: ListQueryOptions = {},
      extraOptions: ExtraOptions<Entity> = {},
    ) {
      const { take, skip } = parsePaginationParams(
        options,
        extraOptions.ignoreQueryLimits ?? false,
      );

      const repo = await ormService.getRepository(entityType);
      const alias = extraOptions?.alias
        ? extraOptions.alias
        : entityType.name.toLowerCase();

      const qb = repo.createQueryBuilder(alias);

      qb.setFindOptions({
        relations: extraOptions.relations,
        take,
        skip,
        relationLoadStrategy: "query",
      });

      return qb;
    },
  };
}

function parsePaginationParams(
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
