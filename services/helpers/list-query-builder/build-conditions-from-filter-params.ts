import type { DataSource } from "typeorm";
import { DateUtils } from "typeorm/util/DateUtils.js";
import {
  type DateTimeFilterOperators,
  type DateTimeRangeInput,
  FilterGroupOperator,
  type NumericFilterOperators,
  type NumericRangeInput,
  type StringFilterOperators,
} from "@/lib/dto/common";
import { UserInputError } from "@/lib/errors/errors";
import type { FilterParameter } from "@/lib/types/list-query-options";
import type { ClassType } from "@/lib/types/shared-types";
import type { AppEntity } from "@/orm/entities/app-entity";
import { getEntityMetadata } from "@/orm/utils/get-entity-metadata";

export interface WhereGroup {
  operator: FilterGroupOperator;
  conditions: Array<WhereCondition | WhereGroup>;
}

export interface WhereCondition {
  clause: string;
  parameters: Record<string, string | number | string[]>;
}

type AllOperators = StringFilterOperators &
  NumericFilterOperators &
  DateTimeFilterOperators;

type Operator = keyof AllOperators;

export function buildConditionFromFilterParams<Entity extends AppEntity>(
  filterParams: FilterParameter<Entity>,
  entityType: ClassType<Entity>,
  dataSource: DataSource,
  entityAlias?: string,
) {
  const {
    columns,
    translationColumns,
    alias: defaultAlias,
  } = getEntityMetadata(dataSource, entityType);

  const alias = entityAlias ?? defaultAlias;

  let argIndex = 1;

  function buildConditionForField(
    filterProp: string,
    operation: FilterParameter<Entity>,
  ): Array<WhereCondition> {
    const output: Array<WhereCondition> = [];

    /*
        filterProp: createdAt
        operation : {
        greaterThan: date
        withinRange: {
            min: date
            max: date
        }
        }
        */

    // field => name: {equals: "ali"}
    // entityAlias.name
    // entityAlias.translationEntityAlias.name

    const matchingColumn = columns.find(
      (col) => col.propertyName === filterProp,
    );
    const matchingTranslationColumn = translationColumns.find(
      (c) => c.propertyName === filterProp,
    );

    let columnPath: string;
    if (matchingColumn) {
      columnPath = `${alias}.${matchingColumn.propertyPath}`;
    } else if (matchingTranslationColumn) {
      const translationsAlias = dataSource.namingStrategy.joinTableName(
        alias,
        "translations",
        "",
        "",
      );
      columnPath = `${translationsAlias}.${matchingTranslationColumn.propertyPath}`;
    } else {
      throw new UserInputError(`Filtering by (${filterProp}) failed.`);
    }

    // Object.entries(operation) -> [[greaterThan, date], [withinRange, {min:date,max:date}]]
    for (const [operator, operand] of Object.entries(operation)) {
      const condition = buildWhereCondition(
        columnPath,
        operator as Operator,
        operand,
        argIndex, // we need to mark each iteration with an index for distinction, because all these operation will end up executing in the same query
      );
      output.push(condition);
      argIndex++;
    }

    return output;
  }

  function processFilterParams(filterParams: FilterParameter<Entity>) {
    /*
    {createdAt: {
        greaterThan: date
        withinRange: {
            min: date
            max: date
        }
    }}

  */
    const result: Array<WhereCondition | WhereGroup> = [];
    for (const [filterProp, operation] of Object.entries(filterParams)) {
      /*
        createdAt, {
        greaterThan: date
        withinRange: {
            min: date
            max: date
        }
        }
        */
      if (filterProp === "_and" || filterProp === "_or") {
        result.push({
          operator:
            filterProp === "_and"
              ? FilterGroupOperator.AND
              : FilterGroupOperator.OR,
          conditions: operation.flatMap((op) =>
            buildConditionForField(filterProp, op),
          ),
        });
      } else if (operation && !Array.isArray(operation)) {
        result.push(...buildConditionForField(filterProp, operation));
      }
    }

    return result;
  }

  return processFilterParams(filterParams);
}

function buildWhereCondition(
  columnPath: string,
  operator: Operator,
  operand: any,
  argIndex: number,
): WhereCondition {
  switch (operator) {
    case "equals":
      return {
        clause: `${columnPath} = :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: convertDate(operand),
        },
      };
    case "notEquals":
      return {
        clause: `${columnPath} != :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: convertDate(operand),
        },
      };
    case "contains": {
      return {
        clause: `${columnPath} ILIKE :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: `%${typeof operand === "string" ? operand.trim() : operand}%`,
        },
      };
    }
    case "doesNotContain": {
      return {
        clause: `${columnPath} NOT ILIKE :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: `%${operand.trim()}%`,
        },
      };
    }
    case "includedIn": {
      if (Array.isArray(operand) && operand.length > 0) {
        return {
          clause: `${columnPath} IN (:...arg${argIndex})`,
          parameters: {
            [`arg${argIndex}`]: operand,
          },
        };
      } else {
        // includedIn: <empty set> so it doesn't participate in the filtering
        return {
          clause: "1 = 0",
          parameters: {},
        };
      }
    }
    case "excludedFrom": {
      if (Array.isArray(operand) && operand.length > 0) {
        return {
          clause: `${columnPath} NOT IN (:...arg${argIndex})`,
          parameters: {
            [`arg${argIndex}`]: operand,
          },
        };
      } else {
        // excludedFrom: <empty set> so it doesn't participate in the filtering
        return {
          clause: "1 = 0",
          parameters: {},
        };
      }
    }
    case "matchesRegex": {
      return {
        clause: `${columnPath} ~* :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: operand,
        },
      };
    }
    case "lessThan":
    case "before": {
      return {
        clause: `${columnPath} < :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: convertDate(operand),
        },
      };
    }
    case "greaterThan":
    case "after": {
      return {
        clause: `${columnPath} > :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: convertDate(operand),
        },
      };
    }
    case "lessThanOrEqual": {
      return {
        clause: `${columnPath} <= :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: operand,
        },
      };
    }
    case "greaterThanOrEqual": {
      return {
        clause: `${columnPath} >= :arg${argIndex}`,
        parameters: {
          [`arg${argIndex}`]: operand,
        },
      };
    }
    case "withinRange": {
      return {
        clause: `${columnPath} BETWEEN :arg${argIndex}_a AND :arg${argIndex}_b`,
        parameters: {
          [`arg${argIndex}_a`]:
            (operand as DateTimeRangeInput).from instanceof Date
              ? convertDate(operand.from)
              : (operand as NumericRangeInput).min,
          [`arg${argIndex}_b`]:
            (operand as DateTimeRangeInput).to instanceof Date
              ? convertDate(operand.to)
              : (operand as NumericRangeInput).max,
        },
      };
    }
    case "isNull": {
      return {
        clause: `${columnPath} ${operand === true ? "IS NULL" : "IS NOT NULL"}`,
        parameters: {},
      };
    }
    default: {
      return {
        clause: "1",
        parameters: {},
      };
    }
  }
}

function convertDate(input: Date | string | number): string | number {
  if (input instanceof Date) {
    return DateUtils.mixedDateToUtcDatetimeString(input);
  }
  return input;
}
