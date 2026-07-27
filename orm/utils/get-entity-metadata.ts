import type { DataSource } from "typeorm";
import type { ColumnMetadata } from "typeorm/metadata/ColumnMetadata.js";
import type { ClassType } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import type { AppEntity } from "../entities/app-entity";

export function getEntityMetadata<Entity>(
  dataSource: DataSource,
  entity: ClassType<Entity>,
): {
  columns: ColumnMetadata[];
  alias: string;
  translationColumns: ColumnMetadata[];
} {
  const metadata = dataSource.getMetadata(entity);
  const columns = metadata.columns;

  const alias = metadata.name.toLowerCase();

  const translationColumns: ColumnMetadata[] = [];

  const translationRelation = metadata.relations.find(
    (r) => r.propertyName === "translations",
  );

  if (translationRelation) {
    const commonFields: Array<keyof (TranslationEntity<Entity> & AppEntity)> = [
      "id",
      "createdAt",
      "updatedAt",
      "languageCode",
    ];
    const translationEntityMetadata = dataSource.getMetadata(
      translationRelation.type,
    );
    for (const translationColumn of translationEntityMetadata.columns) {
      if (
        !translationColumn.relationMetadata &&
        !commonFields.includes(translationColumn.propertyName as any)
      ) {
        translationColumns.push(translationColumn);
      }
    }
  }
  return {
    columns,
    alias,
    translationColumns,
  };
}
