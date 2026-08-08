import { AppError } from "./app-error";

/**
 * @description
 * Represents an error caused by invalid user input.
 * Used when the user provides data that fails validation or business rules.
 */
export class UserInputError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message, 400, "USER_INPUT_ERROR");
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class EntityNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "ENTITY_NOT_FOUND_ERROR");
  }
}

export class UnAuthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED_ERROR");
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("You are not allowed to perform this action", 403, "FORBIDDEN_ERROR");
  }
}
