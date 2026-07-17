import { type ZodSchema, z } from "@/lib/helpers/zod";

export const paginatedListInputSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
});

export type PaginatedListInputSchema = z.infer<typeof paginatedListInputSchema>;

export function createPaginatedListOutputSchema<Item = any>(
  schema: ZodSchema<Item>,
) {
  const paginatedListSchema = z.object({
    items: z.array(schema),
    itemsCount: z.number(),
  });

  return paginatedListSchema;
}
