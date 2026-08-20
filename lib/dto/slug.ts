import { z } from "@/lib/helpers/zod";
import { apiErrorSchema } from "./common";

export const slugForEntityInputSchema = z.object({
  entityName: z.string(),
  entityId: z.string().optional(),
  fieldName: z.string(),
  inputValue: z.string(),
});

export type SlugForEntityInputSchema = z.infer<typeof slugForEntityInputSchema>;

export const slugForEntityOutputSchema = z.union([z.string(), apiErrorSchema]);

export type SlugForEntityOutputSchema = z.infer<
  typeof slugForEntityOutputSchema
>;
