export type I18nConfig = {
  locales: Array<{ key: "en" | "ar" }>;
  defaultLocale: "en" | "ar";
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
