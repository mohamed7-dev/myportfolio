"use client";
import type React from "react";
import { useMemo } from "react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useLocaleUtils } from "@/hooks/use-locale-utils";
import { sharedConfig } from "@/lib/config/shared-config";
import {
  applyFormControlProps,
  getLocaleFallbackPlaceholder,
} from "@/lib/helpers/form";
import type { FormFieldProps } from "./form-field";

export type TranslatableEntity = FieldValues & {
  translations?: Array<{
    languageCode: string;
  }> | null;
};

interface TranslatableFormFieldProps<
  TFieldValues extends TranslatableEntity | TranslatableEntity[],
> extends Omit<FormFieldProps<TFieldValues>, "name"> {
  /**
   * @description
   * The label for the form field.
   */
  label?: React.ReactNode;
  /**
   * @description
   * The name of the form field.
   */
  name: TFieldValues extends TranslatableEntity
    ? keyof Omit<
        NonNullable<TFieldValues["translations"]>[number],
        "languageCode"
      >
    : TFieldValues extends TranslatableEntity[]
      ? keyof Omit<
          NonNullable<TFieldValues[number]["translations"]>[number],
          "languageCode"
        >
      : never;
}

export function TranslatableFormField<
  TFieldValues extends
    | TranslatableEntity
    | TranslatableEntity[] = TranslatableEntity,
>(props: TranslatableFormFieldProps<TFieldValues>) {
  const {
    label,
    name,
    render,
    description,
    renderFormControl = true,
    ...restProps
  } = props;
  const { urlSegmentLocale: contentLanguage } = useLocaleUtils();
  const defaultLanguageCode = sharedConfig.i18n.defaultLocale;

  const formContext = useFormContext();
  const values = formContext.watch();
  const translations =
    (Array.isArray(values)
      ? values?.[0]?.translations
      : values?.translations) ?? [];

  const contentLanguageTransIndex = translations?.findIndex(
    (translation: any) => translation?.languageCode === contentLanguage,
  );

  const isNewTrans = contentLanguageTransIndex === -1;
  const index = isNewTrans ? translations?.length : contentLanguageTransIndex;

  const fallbackPlaceholder = useMemo(
    () =>
      getLocaleFallbackPlaceholder(
        translations,
        defaultLanguageCode,
        contentLanguage,
        String(name),
      ),
    [translations, defaultLanguageCode, contentLanguage, name],
  );

  if (index === undefined || index === -1) {
    return (
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <div className="text-sm text-foreground">
          No translation found for {contentLanguage}
        </div>
      </Field>
    );
  }
  const fieldName =
    `translations.${index}.${String(name)}` as FieldPath<TFieldValues>;

  return (
    <Controller
      {...restProps}
      name={fieldName}
      render={(renderArgs) => {
        const fieldId = `field-${String(name)}`;
        const controlProps: Record<string, unknown> = {
          id: fieldId,
          "aria-invalid": renderArgs.fieldState.invalid || undefined,
        };

        if (fallbackPlaceholder) {
          controlProps.placeholder = fallbackPlaceholder;
        }
        return (
          <Field data-invalid={renderArgs.fieldState.invalid || undefined}>
            {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}

            {renderFormControl
              ? applyFormControlProps(render(renderArgs), controlProps)
              : render(renderArgs)}
            {description && <FieldDescription>{description}</FieldDescription>}
            {renderArgs.fieldState.invalid && (
              <FieldError errors={[renderArgs.fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
}
