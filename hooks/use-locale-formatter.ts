import { useCallback } from "react";
import {
  formatDate as baseFormatDate,
  formatLanguageName as baseFormatLanguageName,
  formatNumber as baseFormatNumber,
} from "@/lib/helpers/locale-utils";
import { useLocaleUtils } from "./use-locale-utils";

export function useLocalFormatter() {
  const { bcp47LanguageTag: locale } = useLocaleUtils();

  const formatDate = useCallback(
    (value: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return baseFormatDate(value, locale, options);
    },
    [locale],
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return baseFormatNumber(value, locale, options);
    },
    [locale],
  );

  const formatLanguageName = useCallback(
    (value: string): string => {
      try {
        return baseFormatLanguageName(value, locale);
      } catch {
        return value;
      }
    },
    [locale],
  );

  return {
    formatDate,
    formatNumber,
    formatLanguageName,
  };
}
