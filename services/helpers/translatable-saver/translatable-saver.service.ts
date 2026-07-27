import "server-only";
import type { FindManyOptions } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
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
  ctx: RequestContext;
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

class TranslatableSaver {
  public async create<Entity extends AppEntity & Translatable>(
    options: CreateTranslatableOptions<Entity>,
  ): Promise<Entity> {
    const {
      ctx,
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
        const repo = await ormService.getRepository(ctx, translationEntityType);
        await repo.save(translation as any);
      }
    }

    entity.translations = translations;
    if (typeof beforeSave === "function") {
      await beforeSave(entity);
    }
    const repo = await ormService.getRepository(ctx, entityType);
    return await repo.save(entity as any, { data: typeOrmSubscriberData });
  }

  public async update<Entity extends AppEntity & Translatable>(
    options: UpdateTranslatableOptions<Entity>,
  ): Promise<Entity> {
    const {
      ctx,
      entityType,
      translationEntityType,
      input,
      beforeSave,
      typeOrmSubscriberData,
    } = options;

    const repo = await ormService.getRepository(ctx, translationEntityType);
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
      ctx,
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

    const entityRepo = await ormService.getRepository(ctx, entityType);
    return entityRepo.save(updatedEntity, {
      data: typeOrmSubscriberData,
    });
  }
}

export const translatableSaver = new TranslatableSaver();
