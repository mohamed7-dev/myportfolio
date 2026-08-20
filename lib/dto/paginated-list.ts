import { type ZodSchema, z } from "@/lib/helpers/zod";

const paginatedListInputSchema = z.object({
  take: z.coerce.number(),
  skip: z.coerce.number(),
});

export function createPaginatedListInputSchema<Filter = any>(
  filterSchema: ZodSchema<Filter>,
) {
  return paginatedListInputSchema
    .extend({ filter: filterSchema })
    .partial()
    .optional();
}

export function createPaginatedListOutputSchema<Item = any>(
  schema: ZodSchema<Item>,
) {
  const paginatedListSchema = z.object({
    items: z.array(schema),
    itemsCount: z.number(),
  });

  return paginatedListSchema;
}
