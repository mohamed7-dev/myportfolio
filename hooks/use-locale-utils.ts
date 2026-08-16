import { useLocale } from "next-intl";
import type { LanguageCode } from "@/lib/dto/language-code";
import {
  getBcp47LanguageTag,
  getLocaleDisplayName,
  isRtl,
} from "@/lib/helpers/locale-utils";

export function useLocaleUtils() {
  const displayLocale = useLocale() as LanguageCode;

  return {
    bcp47LanguageTag: getBcp47LanguageTag(displayLocale),
    languageAndLocaleDisplayName: getLocaleDisplayName(displayLocale),
    isRTL: isRtl(displayLocale),
  };
}
