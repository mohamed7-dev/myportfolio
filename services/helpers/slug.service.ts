import "server-only";
import type { EntityMetadata, ObjectLiteral, Repository } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { UserInputError } from "@/lib/errors/errors";
import { ormService } from "@/orm/orm.service";

export interface SlugForEntityOptions {
  entityName: string;
  fieldName: string;
  inputValue: string;
  entityId?: string;
}

interface EntityFieldInfo {
  metadata: EntityMetadata;
  column: string;
  excludeColumn?: string;
}

class SlugService {
  public generate(_ctx: RequestContext, value: string): string {
    if (!value) {
      return "";
    }
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .split("-")
      .filter(Boolean)
      .join("-");
  }

  public async slugForEntity(
    ctx: RequestContext,
    options: SlugForEntityOptions,
  ): Promise<string> {
    const { entityName, fieldName, inputValue: value, entityId } = options;
    const baseSlug = this.generate(ctx, value);
    if (!baseSlug) {
      return "";
    }
    const field = await this.resolveEntityField(entityName, fieldName);
    const repository = await ormService.getRepository(
      ctx,
      field.metadata.target,
    );
    const exclusion =
      entityId == null
        ? undefined
        : { column: field.excludeColumn ?? "id", value: entityId };
    let slug = baseSlug;
    let suffix = 1;
    while (await this.slugExists(repository, field.column, slug, exclusion)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    return slug;
  }

  private async resolveEntityField(
    entityName: string,
    fieldName: string,
  ): Promise<EntityFieldInfo> {
    const metadata = (await ormService.getDataSource()).entityMetadatas.find(
      (m) => m.name === entityName,
    );
    if (!metadata) {
      throw new UserInputError("Entity not found", { entityName });
    }
    const baseColumn = metadata.columns.find(
      (c) => c.propertyName === fieldName,
    );
    if (baseColumn) {
      return { metadata, column: baseColumn.databaseName };
    }
    const translations = metadata.relations.find(
      (r) => r.propertyName === "translations",
    );
    if (!translations) {
      throw new UserInputError("Entity has no field", {
        entityName,
        fieldName,
      });
    }
    const translationMetadata = (await ormService.getDataSource()).getMetadata(
      translations.type,
    );
    const translationColumn = translationMetadata.columns.find(
      (c) => c.propertyName === fieldName,
    );
    if (!translationColumn) {
      throw new UserInputError("Entity has no field", {
        entityName,
        fieldName,
      });
    }
    const ownerRelation = translationMetadata.relations.find(
      (r) => r.type === metadata.target,
    );
    return {
      metadata: translationMetadata,
      column: translationColumn.databaseName,
      excludeColumn: ownerRelation?.joinColumns?.[0]?.databaseName ?? "baseId",
    };
  }

  private async slugExists(
    repository: Repository<ObjectLiteral>,
    column: string,
    slug: string,
    exclusion?: { column: string; value: string | number },
  ): Promise<boolean> {
    const qb = repository
      .createQueryBuilder("entity")
      .where(`entity.${column} = :slug`, { slug });
    if (exclusion) {
      qb.andWhere(`entity.${exclusion.column} != :id`, { id: exclusion.value });
    }
    return (await qb.getCount()) > 0;
  }
}

export const slugService = new SlugService();
