import { useCallback } from "react";
import { LanguageCode } from "@/lib/dto/language-code";
import { useLocaleUtils } from "./use-locale-utils";

export function useLocalFormatter() {
  const { bcp47LanguageTag: locale } = useLocaleUtils();

  const formatDate = useCallback(
    (value: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, {
        ...options,
        ...(locale === LanguageCode.ar ? { numberingSystem: "arab" } : {}),
      }).format(new Date(value));
    },
    [locale],
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, {
        ...options,
        ...(locale === LanguageCode.ar ? { numberingSystem: "arab" } : {}),
      }).format(value);
    },
    [locale],
  );

  const formatLanguageName = useCallback(
    (value: string): string => {
      try {
        return (
          new Intl.DisplayNames([locale], { type: "language" }).of(
            value.replace("_", "-"),
          ) ?? value
        );
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
