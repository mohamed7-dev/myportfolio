import type { ZodSchema } from "@/lib/helpers/zod";
import { InternalServerError } from "../errors/errors";

export function validateOutput<Output = any>(
  input: any,
  schema: ZodSchema<Output>,
): Output {
  const r = schema.safeParse(input);
  console.log(r.error);
  if (!r.success) {
    throw new InternalServerError("Internal Server Error");
  }

  return r.data as Output;
}
