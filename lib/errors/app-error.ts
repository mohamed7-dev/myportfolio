import type { ApiErrorSchema, ErrorCode } from "../dto/common";

export abstract class AppError extends Error {
  protected constructor(
    /**
     * @description
     * A translation key representing the error message.
     * This key is resolved into a localized string at runtime.
     */
    public readonly message: string,

    /**
     * @description
     * An http status code.
     */
    public readonly statusCode: number,

    /**
     * @description
     * A custom error code.
     */
    public readonly code: ErrorCode,
  ) {
    super(message);
  }
}
export function isAppError<T>(input: T): input is Extract<T, ApiErrorSchema> {
  return (
    typeof input === "object" &&
    input !== null &&
    "code" in input &&
    "message" in input &&
    "statusCode" in input
  );
}
