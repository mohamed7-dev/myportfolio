import type { LanguageCode } from "../dto/language-code";

export function isRtl(locale: LanguageCode) {
  const rtlLanguages = ["ar"];

  const isRTL = rtlLanguages.some((lang) => locale.startsWith(lang));

  return isRTL;
}

export function getBcp47LanguageTag(locale: LanguageCode) {
  const bcp47LanguageTag = locale.match(/[_-]/)
    ? locale.replace(/[_-]/, "-")
    : [locale].filter((x) => !!x).join("-");

  return bcp47LanguageTag;
}

export function getLocaleDisplayName(locale: LanguageCode) {
  const bcp47LanguageTag = getBcp47LanguageTag(locale);
  const languageAndLocaleDisplayName = new Intl.DisplayNames(
    [bcp47LanguageTag],
    {
      type: "language",
    },
  ).of(bcp47LanguageTag);

  return languageAndLocaleDisplayName;
}
