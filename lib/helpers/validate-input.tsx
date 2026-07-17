import { NextResponse } from "next/server";
import type { ZodError, ZodSchema } from "@/lib/helpers/zod";
import { UserInputError } from "../errors/errors";

export function mapZodError(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");
    fields[key] = issue.message;
  }

  return fields;
}

export function validateInput<Output = any>(
  input: any,
  schema: ZodSchema<Output>,
): Output {
  const r = schema.safeParse(input);
  if (!r.success)
    NextResponse.json(
      new UserInputError("Invalid input", mapZodError(r.error)),
    );

  return r.data as Output;
}
