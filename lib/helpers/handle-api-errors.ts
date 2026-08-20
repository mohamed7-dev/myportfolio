import { NextResponse } from "next/server";
import { AppError } from "../errors/app-error";
import { InternalServerError } from "../errors/errors";

export function handleApiErrors(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(error, {
      status: error.statusCode,
      statusText: error.code,
    });
  }

  const genericError = new InternalServerError("An unexpected error occurred");
  return NextResponse.json(genericError, {
    status: genericError.statusCode,
    statusText: genericError.code,
  });
}
