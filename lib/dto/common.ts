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

//############################ Filter Operators ##########################
export const stringFilterOperators = z
  .object({
    equals: z.string(),
    notEquals: z.string(),
    contains: z.string(),
    doesNotContain: z.string(),
    includedIn: z.array(z.string()),
    excludedFrom: z.array(z.string()),
    matchesRegex: z.string(),
    isNull: z.boolean(),
  })
  .partial();

export type StringFilterOperators = z.infer<typeof stringFilterOperators>;

const numericRangeInput = z.object({
  min: z.number(),
  max: z.number(),
});
export type NumericRangeInput = z.infer<typeof numericRangeInput>;

export const numericFilterOperators = z
  .object({
    equals: z.number(),
    lessThan: z.number(),
    lessThanOrEqual: z.number(),
    greaterThan: z.number(),
    greaterThanOrEqual: z.number(),
    withinRange: numericRangeInput,
    isNull: z.boolean(),
  })
  .partial();

export type NumericFilterOperators = z.infer<typeof numericFilterOperators>;

export const booleanFilterOperators = z
  .object({
    equals: z.boolean(),
    isNull: z.boolean(),
  })
  .partial();

export type BooleanFilterOperators = z.infer<typeof booleanFilterOperators>;

const dateTimeRangeInput = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export type DateTimeRangeInput = z.infer<typeof dateTimeRangeInput>;

export const dateTimeFilterOperators = z
  .object({
    equals: z.coerce.date(),
    before: z.coerce.date(),
    after: z.coerce.date(),
    withinRange: dateTimeRangeInput,
    isNull: z.boolean(),
  })
  .partial();

export type DateTimeFilterOperators = z.infer<typeof dateTimeFilterOperators>;

export enum FilterGroupOperator {
  OR = "OR",
  AND = "AND",
}

export const filterGroupOperator = z.nativeEnum(FilterGroupOperator);

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const sortDirection = z.nativeEnum(SortDirection);

//############################ Errors ##########################
export enum ErrorCode {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  USER_INPUT_ERROR = "USER_INPUT_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
  ENTITY_NOT_FOUND_ERROR = "ENTITY_NOT_FOUND_ERROR",
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",
}

const errorCodeSchema = z.nativeEnum(ErrorCode);

export const apiErrorSchema = z.object({
  code: errorCodeSchema,
  message: z.string(),
  statusCode: z.number(),
});

export type ApiErrorSchema = z.infer<typeof apiErrorSchema>;

export const userInputErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.USER_INPUT_ERROR),
  fields: z.record(z.string(), z.string()).optional(),
});

export const conflictErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.CONFLICT_ERROR),
});

export const internalServerErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.INTERNAL_SERVER_ERROR),
});

export const entityNotFoundErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.ENTITY_NOT_FOUND_ERROR),
});

export const unAuthorizedErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.UNAUTHORIZED_ERROR),
});

export const forbiddenErrorSchema = apiErrorSchema.extend({
  code: z.literal(ErrorCode.FORBIDDEN_ERROR),
});
