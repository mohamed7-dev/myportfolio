import { DefaultNamingStrategy } from "typeorm";
import type { ColumnMetadata } from "typeorm/metadata/ColumnMetadata.js";
import type { RelationMetadata } from "typeorm/metadata/RelationMetadata.js";
import { describe, expect, it } from "vitest";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import { FilterGroupOperator } from "@/lib/dto/common";
import type { FilterParameter } from "@/lib/types/list-query-options";
import type { ClassType } from "@/lib/types/shared-types";
import { Asset } from "@/orm/entities/asset/asset.entity";
import { AssetTranslation } from "@/orm/entities/asset/asset-translation.entity";
import {
  buildConditionFromFilterParams,
  type WhereCondition,
  type WhereGroup,
} from "./build-conditions-from-filter-params";

export class MockDataSource {
  private columnsMap = new Map<
    ClassType<any>,
    Array<Partial<ColumnMetadata>>
  >();
  private relationsMap = new Map<
    ClassType<any>,
    Array<Partial<RelationMetadata>>
  >();

  setColumns(
    entity: ClassType<any>,
    value: Array<Partial<ColumnMetadata>>,
  ): void {
    value.forEach((v) => {
      v.propertyPath = v.propertyName;
    });
    this.columnsMap.set(entity, value);
  }

  setRelations(
    entity: ClassType<any>,
    value: Array<Partial<RelationMetadata>>,
  ): void {
    this.relationsMap.set(entity, value);
  }

  getMetadata = (
    entity: ClassType<any>,
  ): {
    name: string;
    columns: Partial<ColumnMetadata>[];
    relations: Partial<RelationMetadata>[];
  } => {
    return {
      name: entity.name,
      columns: this.columnsMap.get(entity) || [],
      relations: this.relationsMap.get(entity) || [],
    };
  };

  namingStrategy = new DefaultNamingStrategy();
  readonly options = {
    type: "sqljs",
  };
}

describe("buildConditionsFromFilterParams()", () => {
  it("works when no filter params get passed", () => {
    const dataSource = new MockDataSource();
    dataSource.setColumns(Asset, [
      {
        propertyName: "id",
      },
      {
        propertyName: "previewIdentifier",
      },
    ]);

    const result = buildConditionFromFilterParams({}, Asset, dataSource as any);
    expect(result).toEqual([]);
  });

  it("works with single filter param", () => {
    const dataSource = new MockDataSource();
    dataSource.setColumns(Asset, [
      {
        propertyName: "id",
      },
      {
        propertyName: "type",
      },
    ]);

    const filterParams: FilterParameter<Asset> = {
      type: {
        equals: ObjectStorageResourceType.image,
      },
    };

    const result = buildConditionFromFilterParams(
      filterParams,
      Asset,
      dataSource as any,
    );

    expect(isWhereCondition(result[0]) && result[0].clause).toBe(
      "asset.type = :arg1",
    );
    expect(isWhereCondition(result[0]) && result[0].parameters).toEqual({
      arg1: ObjectStorageResourceType.image,
    });
  });

  it("works with multiple filter params", () => {
    const dataSource = new MockDataSource();
    dataSource.setColumns(Asset, [
      {
        propertyName: "id",
      },
      {
        propertyName: "type",
      },
      {
        propertyName: "width",
      },
    ]);
    const filterParams: FilterParameter<Asset> = {
      type: {
        equals: ObjectStorageResourceType.image,
      },
      width: {
        greaterThan: 500,
      },
    };

    const result = buildConditionFromFilterParams(
      filterParams,
      Asset,
      dataSource as any,
    );
    const firstWhereCondition = result[0];
    const secondWhereCondition = result[1];
    expect(
      isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
    ).toBe("asset.type = :arg1");
    expect(
      isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
    ).toEqual({
      arg1: ObjectStorageResourceType.image,
    });
    expect(
      isWhereCondition(secondWhereCondition) && secondWhereCondition.clause,
    ).toBe("asset.width > :arg2");
    expect(
      isWhereCondition(secondWhereCondition) && secondWhereCondition.parameters,
    ).toEqual({
      arg2: 500,
    });
  });

  it("works with translated entity fields", () => {
    const dataSource = new MockDataSource();
    dataSource.setColumns(Asset, [
      {
        propertyName: "id",
      },
      {
        propertyName: "type",
      },
      {
        propertyName: "width",
      },
    ]);
    dataSource.setRelations(Asset, [
      {
        propertyName: "translations",
        type: AssetTranslation,
      },
    ]);
    dataSource.setColumns(AssetTranslation, [
      {
        propertyName: "id",
      },
      {
        propertyName: "name",
      },
      {
        propertyName: "base",
        relationMetadata: {} as any,
      },
    ]);

    const filterParams: FilterParameter<Asset> = {
      type: {
        equals: ObjectStorageResourceType.image,
      },
      name: {
        equals: "test-file-name",
      },
    };
    const result = buildConditionFromFilterParams(
      filterParams,
      Asset,
      dataSource as any,
    );
    const firstWhereCondition = result[0];
    const secondWhereCondition = result[1];
    expect(
      isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
    ).toBe("asset.type = :arg1");
    expect(
      isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
    ).toEqual({
      arg1: ObjectStorageResourceType.image,
    });
    expect(
      isWhereCondition(secondWhereCondition) && secondWhereCondition.clause,
    ).toBe("asset__translations.name = :arg2");
    expect(
      isWhereCondition(secondWhereCondition) && secondWhereCondition.parameters,
    ).toEqual({
      arg2: "test-file-name",
    });
  });

  describe("text filter input operators", () => {
    it("equals", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "type",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        type: {
          equals: ObjectStorageResourceType.image,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.type = :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: ObjectStorageResourceType.image,
      });
    });
    it("contains", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "mimetype",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        mimetype: {
          contains: "image",
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.mimetype LIKE :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: "%image%",
      });
    });
  });

  describe("numeric filter input operators", () => {
    it("equals", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          equals: 500,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width = :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: 500,
      });
    });
    it("greaterThan", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          greaterThan: 500,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width > :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: 500,
      });
    });
    it("greaterThanOrEqual", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          greaterThanOrEqual: 500,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width >= :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: 500,
      });
    });
    it("lessThan", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          lessThan: 500,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width < :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: 500,
      });
    });
    it("lessThanOrEqual", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          lessThanOrEqual: 500,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width <= :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: 500,
      });
    });
    it("withinRange", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "width",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        width: {
          withinRange: {
            min: 0,
            max: 500,
          },
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.width BETWEEN :arg1_a AND :arg1_b");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1_a: 0,
        arg1_b: 500,
      });
    });
  });

  describe("datetime filter input operators", () => {
    it("equals", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "createdAt",
          type: "datetime",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        createdAt: {
          equals: new Date("2018-01-01T10:00:00.000Z"),
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.createdAt = :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: "2018-01-01 10:00:00.000",
      });
    });
    it("before", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "createdAt",
          type: "datetime",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        createdAt: {
          before: new Date("2018-01-01T10:00:00.000Z"),
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.createdAt < :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: "2018-01-01 10:00:00.000",
      });
    });
    it("after", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "createdAt",
          type: "datetime",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        createdAt: {
          after: new Date("2018-01-01T10:00:00.000Z"),
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.createdAt > :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: "2018-01-01 10:00:00.000",
      });
    });
    it("withinRange", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "createdAt",
          type: "datetime",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        createdAt: {
          withinRange: {
            from: new Date("2018-01-01T10:00:00.000Z"),
            to: new Date("2018-02-01T10:00:00.000Z"),
          },
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.createdAt BETWEEN :arg1_a AND :arg1_b");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1_a: "2018-01-01 10:00:00.000",
        arg1_b: "2018-02-01 10:00:00.000",
      });
    });
  });

  describe("boolean filter input operators", () => {
    it("equals", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "id",
        },
        {
          propertyName: "isFeatured",
          type: "boolean",
        },
      ]);
      const filterParams: FilterParameter<
        Asset & {
          isFeatured: boolean;
        }
      > = {
        isFeatured: {
          equals: true,
        },
      };

      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereCondition = result[0];
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.clause,
      ).toBe("asset.isFeatured = :arg1");
      expect(
        isWhereCondition(firstWhereCondition) && firstWhereCondition.parameters,
      ).toEqual({
        arg1: true,
      });
    });
  });

  describe("filter group operator", () => {
    it("supports and semantic", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "width",
        },
        {
          propertyName: "type",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        _and: [
          {
            type: {
              equals: ObjectStorageResourceType.image,
            },
          },
          {
            width: {
              greaterThan: 500,
            },
          },
        ],
      };
      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereGroup = result[0];
      expect(isWhereGroup(firstWhereGroup) && firstWhereGroup.operator).toBe(
        FilterGroupOperator.AND,
      );
      expect(
        isWhereGroup(firstWhereGroup) && firstWhereGroup.conditions,
      ).toEqual([
        {
          clause: "asset.type = :arg1",
          parameters: {
            arg1: ObjectStorageResourceType.image,
          },
        },
        {
          clause: "asset.width > :arg2",
          parameters: {
            arg2: 500,
          },
        },
      ]);
    });
    it("supports or semantic", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "width",
        },
        {
          propertyName: "type",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        _or: [
          {
            type: {
              equals: ObjectStorageResourceType.image,
            },
          },
          {
            width: {
              greaterThan: 500,
            },
          },
        ],
      };
      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereGroup = result[0];
      expect(isWhereGroup(firstWhereGroup) && firstWhereGroup.operator).toBe(
        FilterGroupOperator.OR,
      );
      expect(
        isWhereGroup(firstWhereGroup) && firstWhereGroup.conditions,
      ).toEqual([
        {
          clause: "asset.type = :arg1",
          parameters: {
            arg1: ObjectStorageResourceType.image,
          },
        },
        {
          clause: "asset.width > :arg2",
          parameters: {
            arg2: 500,
          },
        },
      ]);
    });
    it("supports nesting and, or semantics", () => {
      const dataSource = new MockDataSource();
      dataSource.setColumns(Asset, [
        {
          propertyName: "width",
        },
        {
          propertyName: "type",
        },
      ]);
      const filterParams: FilterParameter<Asset> = {
        _and: [
          {
            width: {
              greaterThan: 500,
            },
          },
          {
            _or: [
              {
                type: {
                  equals: ObjectStorageResourceType.image,
                },
              },
              {
                type: {
                  equals: ObjectStorageResourceType.video,
                },
              },
            ],
          },
        ],
      };
      const result = buildConditionFromFilterParams(
        filterParams,
        Asset,
        dataSource as any,
      );
      const firstWhereGroup = result[0];
      expect(isWhereGroup(firstWhereGroup) && firstWhereGroup.operator).toBe(
        FilterGroupOperator.AND,
      );
      expect(
        isWhereGroup(firstWhereGroup) && firstWhereGroup.conditions,
      ).toEqual([
        {
          clause: "asset.width > :arg1",
          parameters: {
            arg1: 500,
          },
        },
        {
          operator: FilterGroupOperator.OR,
          conditions: [
            {
              clause: "asset.type = :arg2",
              parameters: {
                arg2: ObjectStorageResourceType.image,
              },
            },
            {
              clause: "asset.type = :arg3",
              parameters: {
                arg3: ObjectStorageResourceType.video,
              },
            },
          ],
        },
      ]);
    });
  });
});

function isWhereCondition(
  item: WhereCondition | WhereGroup,
): item is WhereCondition {
  return "clause" in item;
}

function isWhereGroup(item: WhereCondition | WhereGroup): item is WhereGroup {
  return "conditions" in item;
}
