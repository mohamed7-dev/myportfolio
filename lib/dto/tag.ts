import { z } from "@/lib/helpers/zod";
import { baseSchema } from "./common";

export const tag = baseSchema.extend({
  value: z.string(),
});

export type Tag = z.infer<typeof tag>;
