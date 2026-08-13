import type { LanguageCode } from "@/lib/dto/language-code";

export type I18nConfig = {
  locales: Array<{ key: LanguageCode }>;
  defaultLocale: LanguageCode;
};

export const i18nConfig: I18nConfig = {
  locales: [
    {
      key: "en",
    },
    {
      key: "ar",
    },
  ],
  defaultLocale: "en",
} as const;
