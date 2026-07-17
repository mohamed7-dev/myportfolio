import { z } from "@/lib/helpers/zod";

export const deletionResponseSchema = z.object({
  result: z.enum(["DELETED", "NOT_DELETED"]),
  message: z.string(),
});

export type DeletionResponse = z.infer<typeof deletionResponseSchema>;
