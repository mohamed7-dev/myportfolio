import type React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { applyFormControlProps } from "@/lib/helpers/form";

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  renderFormControl?: boolean;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldProps<TFieldValues, TName>) {
  const {
    label,
    description,
    renderFormControl = true,
    name,
    render,
    ...controllerProps
  } = props;
  return (
    <Controller
      {...controllerProps}
      name={name}
      render={(renderArgs) => {
        const fieldId = `field-${name}`;
        const controlProps = {
          id: fieldId,
          "aria-invalid": renderArgs.fieldState.invalid || undefined,
        };
        return (
          <Field>
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
