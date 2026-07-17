import type { LanguageCode } from "../dto/language-code";

interface AppConfig {
  defaultLanguageCode: LanguageCode;
  listQueryLimit: number;
}

export const appConfig: AppConfig = {
  defaultLanguageCode: "en",
  listQueryLimit: 100,
};
