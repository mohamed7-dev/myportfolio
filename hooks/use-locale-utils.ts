import { useCurrentLocale } from "@/i18n/client";
import type { LanguageCode } from "@/lib/dto/language-code";
import {
  getBcp47LanguageTag,
  getLocaleDisplayName,
  isRtl,
} from "@/lib/helpers/locale-utils";

export function useLocaleUtils() {
  const displayLocale = useCurrentLocale() as LanguageCode;

  return {
    bcp47LanguageTag: getBcp47LanguageTag(displayLocale),
    languageAndLocaleDisplayName: getLocaleDisplayName(displayLocale),
    isRTL: isRtl(displayLocale),
    urlSegmentLocale: displayLocale,
  };
}
