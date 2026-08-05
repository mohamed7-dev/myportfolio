import { z } from "@/lib/helpers/zod";

export const slugForEntityInputSchema = z.object({
  entityName: z.string(),
  entityId: z.string().optional(),
  fieldName: z.string(),
  inputValue: z.string(),
});

export type SlugForEntityInputSchema = z.infer<typeof slugForEntityInputSchema>;

export const slugForEntityOutputSchema = z.string();

export type SlugForEntityOutputSchema = z.infer<
  typeof slugForEntityOutputSchema
>;
