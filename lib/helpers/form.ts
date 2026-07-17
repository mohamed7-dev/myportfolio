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
