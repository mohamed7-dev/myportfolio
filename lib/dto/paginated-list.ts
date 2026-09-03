import { type ZodSchema, z } from "@/lib/helpers/zod";

const paginatedListInputSchema = z.object({
  take: z.coerce.number(),
  skip: z.coerce.number(),
});

export function createPaginatedListInputSchema<Filter = any, Sort = any>(
  filterSchema: ZodSchema<Filter>,
  sortSchema: ZodSchema<Sort>,
) {
  return paginatedListInputSchema
    .extend({ filter: filterSchema })
    .extend({ sort: sortSchema })
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
