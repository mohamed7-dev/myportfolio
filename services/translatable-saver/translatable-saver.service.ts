import "server-only";
import type { FindManyOptions } from "typeorm";
import type { ClassType } from "@/lib/types/shared-types";
import type {
  Translatable,
  TranslatedInput,
  TranslationEntity,
} from "@/lib/types/translatable";
import { omit } from "@/lib/utils/omit";
import type { AppEntity } from "@/orm/entities/app-entity";
import { ormService } from "@/orm/orm.service";
import { patchEntity } from "@/orm/utils/patch-entity";
import { TranslationDiffer } from "./differ";

export interface CreateTranslatableOptions<Entity extends Translatable> {
  entityType: ClassType<Entity>;
  translationEntityType: ClassType<TranslationEntity<Entity>>;
  input: TranslatedInput<Entity>;
  beforeSave?: (newEntity: Entity) => any | Promise<any>;
  typeOrmSubscriberData?: any;
}

export interface UpdateTranslatableOptions<Entity extends Translatable>
  extends CreateTranslatableOptions<Entity> {
  input: TranslatedInput<Entity> & {
    id: string;
  };
}

export function translatableSaver() {
  return {
    async create<Entity extends AppEntity & Translatable>(
      options: CreateTranslatableOptions<Entity>,
    ): Promise<Entity> {
      return await _create(options);
    },
    async update<Entity extends AppEntity & Translatable>(
      options: UpdateTranslatableOptions<Entity>,
    ) {
      return await _update(options);
    },
  };
}

async function _create<Entity extends AppEntity & Translatable>(
  options: CreateTranslatableOptions<Entity>,
): Promise<Entity> {
  const {
    entityType,
    translationEntityType,
    input,
    beforeSave,
    typeOrmSubscriberData,
  } = options;

  const entity = new entityType(input);

  const translations: Array<TranslationEntity<Entity>> = [];

  if (input.translations) {
    for (const translationInput of input.translations) {
      const translation = new translationEntityType(translationInput);
      translations.push(translation);
      const repo = await ormService.getRepository(translationEntityType);
      await repo.save(translation as any);
    }
  }

  entity.translations = translations;
  if (typeof beforeSave === "function") {
    await beforeSave(entity);
  }
  const repo = await ormService.getRepository(entityType);
  return await repo.save(entity as any, { data: typeOrmSubscriberData });
}

async function _update<Entity extends AppEntity & Translatable>(
  options: UpdateTranslatableOptions<Entity>,
): Promise<Entity> {
  const {
    entityType,
    translationEntityType,
    input,
    beforeSave,
    typeOrmSubscriberData,
  } = options;

  const repo = await ormService.getRepository(translationEntityType);
  const foundTranslations = await repo.find({
    relationLoadStrategy: "query",
    loadEagerRelations: false,
    where: {
      base: {
        id: input.id,
      },
    },
    relations: {
      base: true,
    },
  } as FindManyOptions<TranslationEntity<Entity>>);

  const differ = new TranslationDiffer(translationEntityType);
  const diff = differ.diff(foundTranslations, input.translations);
  const entity = await differ.applyDiff(
    new entityType({
      ...input,
      translations: foundTranslations,
    }),
    diff,
  );
  entity.updatedAt = new Date();
  const updatedEntity = patchEntity(
    entity as any,
    omit(input, ["translations"]),
  );
  if (typeof beforeSave === "function") {
    await beforeSave(entity);
  }

  const entityRepo = await ormService.getRepository(entityType);
  return entityRepo.save(updatedEntity, {
    data: typeOrmSubscriberData,
  });
}
