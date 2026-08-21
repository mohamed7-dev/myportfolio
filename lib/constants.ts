import { LanguageCode } from "./dto/language-code";

export const NEW_ENTITY_PATH = "new";
export const DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE: LanguageCode =
  LanguageCode["en"];
export const TRANSACTION_MANAGER_KEY = Symbol("TRANSACTION_MANAGER");
export const LOCALE_HEADER = "X-Locale";
