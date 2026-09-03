import type { DataSource, OrderByCondition } from "typeorm";
import type { ColumnMetadata } from "typeorm/metadata/ColumnMetadata.js";
import { UserInputError } from "@/lib/errors/errors";
import type { SortParameter } from "@/lib/types/list-query-options";
import type { ClassType } from "@/lib/types/shared-types";
import { filterUnique } from "@/lib/utils/filter-unique";
import type { AppEntity } from "@/orm/entities/app-entity";
import { getEntityMetadata } from "../../../orm/utils/get-entity-metadata";

export function buildOrderbyFromSortParams<Entity extends AppEntity>(
  dataSource: DataSource,
  entityType: ClassType<Entity>,
  sortParams?: SortParameter<Entity> | null,
  entityAlias?: string,
): OrderByCondition {
  if (!sortParams) return {};

  const {
    columns,
    alias: defaultAlias,
    translationColumns,
  } = getEntityMetadata(dataSource, entityType);

  const alias = entityAlias ?? defaultAlias;

  const output: OrderByCondition = {};

  for (const [sortProp, direction] of Object.entries(sortParams)) {
    const columnMatch = columns.find((col) => col.propertyName === sortProp);
    const translationColumnMatch = translationColumns.find(
      (col) => col.propertyName === sortProp,
    );
    if (columnMatch) {
      output[`${alias}.${columnMatch.propertyPath}`] = direction as any;
    } else if (translationColumnMatch) {
      const translationsAlias = dataSource.namingStrategy.joinTableName(
        alias,
        "translations",
        "",
        "",
      );

      output[`${translationsAlias}.${translationColumnMatch.propertyPath}`] =
        direction as any;
    } else {
      throw new UserInputError("Invalid sort fields", {
        fieldName: sortProp,
        validFields: [
          ...getValidSortFields([...columns, ...translationColumns]),
        ].join(","),
      });
    }
  }

  return output;
}

function getValidSortFields(columns: ColumnMetadata[]): string[] {
  return filterUnique(columns.map((c) => c.propertyName));
}
