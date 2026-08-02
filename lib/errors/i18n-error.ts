import type { AppEntity } from "@/orm/entities/app-entity";

export abstract class AppError extends Error {
  protected constructor(
    /**
     * @description
     * A translation key representing the error message.
     * This key is resolved into a localized string at runtime.
     */
    public message: string,

    /**
     * @description
     * An http status code.
     */
    public statusCode: number,

    /**
     * @description
     * A custom error code.
     */
    public code?: string,
  ) {
    super(message);
  }
}

// exclude result if it doesn't extend the AppError
export type JustErrorResults<Result extends AppError | U, U = any> = Exclude<
  Result,
  Result extends AppError ? never : Result
>;

// union of a AppError and AppEntity
export type ErrorResultUnion<
  Result extends AppError | U,
  Entity extends AppEntity,
  U = any,
> = JustErrorResults<Result> | Entity;

export function isApiError<Result extends AppError | U, U = any>(
  input: Result,
): input is JustErrorResults<Result>;
export function isApiError<Result, Entity extends AppEntity>(
  input: ErrorResultUnion<Result, Entity>,
): input is JustErrorResults<ErrorResultUnion<Result, Entity>> {
  return (
    input &&
    !!(
      (input as unknown as AppError).statusCode &&
      (input as unknown as AppError).message != null
    )
  );
}
