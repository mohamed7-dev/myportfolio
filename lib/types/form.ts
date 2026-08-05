import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

export type FormComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName>;
