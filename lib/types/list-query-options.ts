import type { AppEntity } from "@/orm/entities/app-entity";
import type {
  BooleanFilterOperators,
  DateTimeFilterOperators,
  NumericFilterOperators,
  StringFilterOperators,
} from "../dto/common";
import type { LocaleString } from "./translatable";

export interface ListQueryOptions<Entity extends AppEntity> {
  take?: number;
  skip?: number;
  filter?: FilterParameter<Entity> | null;
}

export type PrimitiveFields<Entity extends AppEntity> = {
  [Key in keyof Entity]: NonNullable<Entity[Key]> extends
    | LocaleString
    | number
    | string
    | boolean
    | Date
    ? Key
    : never;
}[keyof Entity];

export type FilterParameter<Entity extends AppEntity> = {
  [Key in PrimitiveFields<Entity>]?: Entity[Key] extends string | LocaleString
    ? StringFilterOperators
    : Entity[Key] extends number
      ? NumericFilterOperators
      : Entity[Key] extends boolean
        ? BooleanFilterOperators
        : Entity[Key] extends Date
          ? DateTimeFilterOperators
          : StringFilterOperators;
} & {
  _and?: Array<FilterParameter<Entity>>;
  _or?: Array<FilterParameter<Entity>>;
};
