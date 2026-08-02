import { z } from "@/lib/helpers/zod";
import { languageCodeSchema } from "./language-code";

//############################ Deletion Response ##########################

export const deletionResponseSchema = z.object({
  result: z.enum(["DELETED", "NOT_DELETED"]),
  message: z.string(),
});

export type DeletionResponse = z.infer<typeof deletionResponseSchema>;

//############################ One ##########################
export const inputIdSchema = z.object({
  id: z.string(),
});

export type InputIdSchema = z.infer<typeof inputIdSchema>;

//############################ Many ##########################

export const inputIdsSchema = z.object({
  ids: z.array(z.string()),
});
export type InputIdsSchema = z.infer<typeof inputIdsSchema>;

//############################ Base Schema ##########################
export const baseSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

//############################ Base Translation Entity ##########################
export const baseTranslationEntity = baseSchema.extend({
  languageCode: languageCodeSchema,
});

//############################ Base Translation Entity Input ##########################

export const baseTranslationEntityInput = z.object({
  languageCode: languageCodeSchema,
});

//############################ Api Error ##########################

export const apiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  message: z.string(),
});
