import { appConfig } from "@/lib/config/app-config";
import { DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE } from "@/lib/constants";
import type { LanguageCode } from "@/lib/dto/language-code";
import type {
  Translatable,
  Translated,
  TranslationEntity,
} from "@/lib/types/translatable";
import type { AppEntity } from "@/orm/entities/app-entity";

export function translator() {
  return {
    translate<TranslatableEntity extends AppEntity & Translatable>(
      contextLanguageCode: LanguageCode,
      translatableEntity: TranslatableEntity,
    ) {
      return _translate(contextLanguageCode, translatableEntity);
    },
  };
}

function _translate<TranslatableEntity extends AppEntity & Translatable>(
  contextLanguageCode: LanguageCode,
  translatableEntity: TranslatableEntity,
) {
  return translateRecursively(translatableEntity, [
    contextLanguageCode,
    appConfig.defaultLanguageCode,
  ]);
}

function translateRecursively<
  TranslatableEntity extends AppEntity & Translatable,
>(
  translatableEntity: TranslatableEntity,
  languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
): Translated<TranslatableEntity> {
  let translatedEntity: Translated<TranslatableEntity>;

  try {
    translatedEntity = translateEntity(translatableEntity, languageCode);
  } catch {
    translatedEntity = translatableEntity as any;
  }

  return translatedEntity;
}

function translateEntity<TranslatableEntity extends AppEntity & Translatable>(
  translatableEntity: TranslatableEntity,
  languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
): Translated<TranslatableEntity> {
  let translation: TranslationEntity<AppEntity> | undefined;
  let defaultTranslation: TranslationEntity<AppEntity> | undefined;

  if (translatableEntity.translations) {
    if (Array.isArray(languageCode)) {
      for (const lc of languageCode) {
        translation = translatableEntity.translations.find(
          (tr) => tr.languageCode === lc,
        );
        if (translation) break;
      }
    } else {
      translation = translatableEntity.translations.find(
        (tr) => tr.languageCode === languageCode,
      );
    }

    if (
      !translation &&
      languageCode !== DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE
    ) {
      // if no translation found up to this point, we fallback to resolving the translation of the default languageCode
      defaultTranslation = translatableEntity.translations.find(
        (t) => t.languageCode === DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE,
      );
      translation = defaultTranslation;
    }

    if (!translation) {
      // Last resort: if no translation found, we fallback to returning the first translation to suppress the graphql error
      translation = translatableEntity.translations[0];
    }
  }

  if (!translation) {
    // throw new InternalServerError(
    //   "error.entity_has_no_translation_in_language",
    //   {
    //     entityName: translatableEntity.constructor.name,
    //     languageCode: Array.isArray(languageCode)
    //       ? languageCode.join()
    //       : languageCode,
    //   },
    // );
    throw new Error("error"); // TODO: create error class
  }

  const translatedEntity = Object.create(
    Object.getPrototypeOf(translatableEntity),
    Object.getOwnPropertyDescriptors(translatableEntity),
  );

  for (const [key, value] of Object.entries(translation)) {
    if (
      key !== "id" &&
      key !== "createdAt" &&
      key !== "updatedAt" &&
      key !== "base"
    ) {
      if (key !== "languageCode" && (value == null || value === "")) {
        translatedEntity[key] = "";
      } else {
        translatedEntity[key] = value ?? "";
      }
    }
  }
  return translatedEntity;
}
