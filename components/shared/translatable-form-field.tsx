"use client";
import React from "react";
import {
  Controller,
  type ControllerProps,
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
import { useCurrentLocale } from "@/i18n/client";
import { applyFormControlProps } from "@/lib/helpers/form";
import type { FormFieldProps } from "./form-field";

export type TranslatableEntity = FieldValues & {
  translations?: Array<{
    languageCode: string;
  }> | null;
};

interface TranslatableFieldControllerProps<
  TFieldValues extends TranslatableEntity | TranslatableEntity[],
> extends Omit<ControllerProps<TFieldValues>, "name"> {
  name: FieldPath<TFieldValues>;
  index: number;
  isNewTranslation: boolean;
  contentLanguage: string;
}

const TranslatableFieldController = <
  TFieldValues extends TranslatableEntity | TranslatableEntity[],
>({
  index,
  isNewTranslation,
  contentLanguage,
  ...props
}: TranslatableFieldControllerProps<TFieldValues>) => {
  const formContext = useFormContext();

  React.useEffect(() => {
    if (isNewTranslation) {
      const translations = formContext.getValues("translations") || [];
      const currentLangCode = translations[index]?.languageCode;
      if (currentLangCode !== contentLanguage) {
        formContext.setValue(
          `translations.${index}.languageCode`,
          contentLanguage,
          {
            shouldDirty: true,
          },
        );
      }
    }
  }, [
    isNewTranslation,
    index,
    contentLanguage,
    formContext.setValue,
    formContext.getValues,
  ]);

  return <Controller key={`${props.name}-${contentLanguage}`} {...props} />;
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
  const languageCode = useCurrentLocale();

  const formContext = useFormContext();
  const values = formContext.watch();
  const translations = Array.isArray(values)
    ? values?.[0]?.translations
    : values?.translations;
  const contentLanguageTransIndex = translations?.findIndex(
    (translation: any) => translation?.languageCode === languageCode,
  );

  const isNewTrans = contentLanguageTransIndex === -1;
  const index = isNewTrans ? translations?.length : contentLanguageTransIndex;
  if (index === undefined || index === -1) {
    return (
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <div className="text-sm text-foreground">
          No translation found for {languageCode}
        </div>
      </Field>
    );
  }
  const fieldName =
    `translations.${index}.${String(name)}` as FieldPath<TFieldValues>;

  return (
    <TranslatableFieldController
      {...restProps}
      name={fieldName}
      render={(renderArgs) => {
        const fieldId = `field-${String(name)}`;
        const controlProps: Record<string, unknown> = {
          id: fieldId,
          "aria-invalid": renderArgs.fieldState.invalid || undefined,
        };
        // TODO: add placeholder
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
      index={index}
      isNewTranslation={isNewTrans}
      contentLanguage={languageCode}
    />
  );
}
