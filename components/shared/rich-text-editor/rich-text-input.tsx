"use client";
import React from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { RichTextEditor } from "../rich-text-editor/rich-text-editor";

export type FormControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName>;

interface RichTextInputProps extends FormControllerProps {
  placeholder?: string;
}

export function RichTextInput(props: RichTextInputProps) {
  const { value, onChange, disabled, placeholder } = props;

  const trimmedPlaceholder = React.useMemo(
    () =>
      placeholder
        ? new DOMParser()
            .parseFromString(placeholder, "text/html")
            .body.textContent?.trim() || undefined
        : undefined,
    [placeholder],
  );

  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      disabled={Boolean(disabled)}
      placeholder={trimmedPlaceholder}
    />
  );
}
