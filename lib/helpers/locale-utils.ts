import { LanguageCode } from "../dto/language-code";

export function isRtl(locale: string) {
  const rtlLanguages = ["ar"];

  const isRTL = rtlLanguages.some((lang) => locale.startsWith(lang));

  return isRTL;
}

export function getBcp47LanguageTag(locale: string) {
  const bcp47LanguageTag = locale.match(/[_-]/)
    ? locale.replace(/[_-]/, "-")
    : [locale].filter((x) => !!x).join("-");

  return bcp47LanguageTag;
}

export function getLocaleDisplayName(locale: string) {
  const bcp47LanguageTag = getBcp47LanguageTag(locale);
  const languageAndLocaleDisplayName = new Intl.DisplayNames(
    [bcp47LanguageTag],
    {
      type: "language",
    },
  ).of(bcp47LanguageTag);

  return languageAndLocaleDisplayName;
}

export const formatDate = (
  value: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    ...(locale === LanguageCode.ar ? { numberingSystem: "arab" } : {}),
  }).format(new Date(value));
};

export const formatNumber = (
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat(locale, {
    ...options,
    ...(locale === LanguageCode.ar ? { numberingSystem: "arab" } : {}),
  }).format(value);
};

export const formatLanguageName = (value: string, locale: string): string => {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(
        value.replace("_", "-"),
      ) ?? value
    );
  } catch {
    return value;
  }
};
