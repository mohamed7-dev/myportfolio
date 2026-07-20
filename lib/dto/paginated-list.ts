import { type ZodSchema, z } from "@/lib/helpers/zod";

export const paginatedListInputSchema = z.object({
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});

export type PaginatedListInputSchema = z.infer<typeof paginatedListInputSchema>;

export const paginatedSoftDeletableListInputSchema =
  paginatedListInputSchema.extend({
    includeSoftDeleted: z.boolean().optional(),
  });

export type PaginatedSoftDeletableListInputSchema = z.infer<
  typeof paginatedSoftDeletableListInputSchema
>;

export function createPaginatedListOutputSchema<Item = any>(
  schema: ZodSchema<Item>,
) {
  const paginatedListSchema = z.object({
    items: z.array(schema),
    itemsCount: z.number(),
  });

  return paginatedListSchema;
}
