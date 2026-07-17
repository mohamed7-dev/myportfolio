import type { AppEntity } from "@/orm/entities/app-entity";
import type { LanguageCode } from "../dto/language-code";

export type LocaleString = string & {
  _opaqueType: "LocaleString";
};

export type TranslatableKeys<
  Entity,
  EntityWithNoTrans = Omit<Entity, "translations">,
> = {
  [Key in keyof EntityWithNoTrans]: EntityWithNoTrans[Key] extends LocaleString
    ? Key
    : never;
}[keyof EntityWithNoTrans];

export type TranslationEntity<Entity> = {
  base: Entity;
  languageCode: LanguageCode;
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & { [Key in TranslatableKeys<Entity>]: string };

export interface Translatable {
  translations: Array<TranslationEntity<AppEntity>>;
}

/**
 * @description
 * This type represents an entity after being translated
 */
export type Translated<Entity> = Entity & {
  languageCode: LanguageCode;
};

/**
 * @description
 * This type represents the input provided to create or update operations when these operations expect translations
 */
export type TranslationInput<T> = {
  [K in TranslatableKeys<T>]?: string | null;
} & {
  id?: string | null;
  languageCode: LanguageCode | `${LanguageCode}`;
};

/**
 * @description
 * This interface defines the shape of the dto passed to create or update operations then these operations expect translations
 */
export interface TranslatedInput<Entity> {
  translations?: Array<TranslationInput<Entity>>;
}

export type WithTranslation<Input, Translation> = Omit<
  Input,
  "translations"
> & {
  translations?: Array<
    Translation & {
      languageCode: LanguageCode;
    }
  >;
};
