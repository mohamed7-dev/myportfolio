import { z } from "@/lib/helpers/zod";
import { baseSchema, sortDirection, stringFilterOperators } from "./common";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

export const tag = baseSchema.extend({
  value: z.string(),
});

export type Tag = z.infer<typeof tag>;

// ############################## List ###########################
export const tagListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      value: stringFilterOperators,
    })
    .partial(),
  z
    .object({
      value: sortDirection,
    })
    .partial(),
);

export type TagListInputSchema = z.infer<typeof tagListInputSchema>;

export const tagListOutputSchema = createPaginatedListOutputSchema(tag);

export type TagListOutputSchema = z.infer<typeof tagListOutputSchema>;
