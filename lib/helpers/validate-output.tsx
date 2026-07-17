import { NextResponse } from "next/server";
import type { ZodSchema } from "@/lib/helpers/zod";
import { InternalServerError } from "../errors/errors";

export function validateOutput<Output = any>(
  input: any,
  schema: ZodSchema<Output>,
): Output {
  const r = schema.safeParse(input);
  if (!r.success)
    NextResponse.json(new InternalServerError("Internal Server Error"));

  return r.data as Output;
}
