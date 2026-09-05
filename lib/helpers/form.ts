import React from "react";
import { FormProvider } from "react-hook-form";

export const Form = FormProvider;

/**
 * @description
 * Injects A11y attributes such as `id` and `aria-invalid` onto the form control
 * instead of doing it each time manually
 */
export function applyFormControlProps(
  element: React.ReactNode,
  props: Record<string, unknown>,
) {
  if (!React.isValidElement(element)) return element;
  return React.cloneElement(
    element as React.ReactElement<Record<string, unknown>>,
    props,
  );
}

type Translation = {
  languageCode: string;
  [key: string]: unknown;
};

function getNestedValue(
  object: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current !== null && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, object);
}

/**
 * Returns a fallback placeholder based on the value of the field
 * in the default-language translation.
 *
 * A fallback is only returned when:
 * - a default language exists,
 * - the current content language differs from it,
 * - a translation for the default language exists,
 * - and the requested field contains a non-empty string.
 */
export function getLocaleFallbackPlaceholder(
  translations: Translation[] | null | undefined,
  defaultLanguageCode: string | undefined,
  contentLanguage: string,
  fieldPath: string,
): string | undefined {
  // No fallback is needed when there is no default language
  // or we're already editing the default language.
  if (
    !defaultLanguageCode ||
    contentLanguage === defaultLanguageCode ||
    !translations?.length
  ) {
    return undefined;
  }

  const defaultTranslation = translations.find(
    ({ languageCode }) => languageCode === defaultLanguageCode,
  );

  if (!defaultTranslation) {
    return undefined;
  }

  const value = getNestedValue(defaultTranslation, fieldPath);

  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return `Fallback: ${value}`;
}
