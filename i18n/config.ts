export type I18nConfig = {
  locales: Array<{ key: "en" | "ar"; displayName: string }>;
  defaultLocale: "en" | "ar";
};

export const i18nConfig: I18nConfig = {
  locales: [
    {
      key: "en",
      displayName: "English",
    },
    {
      key: "ar",
      displayName: "Arabic",
    },
  ],
  defaultLocale: "en",
} as const;
