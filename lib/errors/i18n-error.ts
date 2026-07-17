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
