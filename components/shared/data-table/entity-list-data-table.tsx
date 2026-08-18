"use client";
import { useMutation } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type { Asset } from "@/lib/dto/asset";
import type { DeletionResponse } from "@/lib/dto/common";
import { ActionMenuItemWithConfirmation } from "../action-menu-item-with-confirmation";
import { AssetDisplay } from "../assets/asset-display";
import type { EntityListBulkAction } from "./bulk-actions-bar";
import { DataTable, type DataTableActionBarItem } from "./data-table";
import { type RowAction, RowActions } from "./row-actions";

interface EntityListDataTableProps<
  Data extends { id: string },
  DeleteMInput extends { ids: string[] },
  DeleteMOutput,
> {
  data: Data[];
  totalItemsCount?: number;
  columns: ColumnDef<Data>[];
  deleteMutationFn: (input: DeleteMInput) => Promise<DeleteMOutput>;
  entityName: string;
  rowActions?: RowAction<Data>[];
  refetch: () => void;
  bulkActions?: EntityListBulkAction<Data[]>[];
  actionBarItems?: DataTableActionBarItem<Data>[];
}

export function EntityListDataTable<
  Data extends { id: string; featuredAsset?: Asset | null },
  DeleteMInput extends { ids: string[] },
  DeleteMOutput extends Array<DeletionResponse>,
>({
  data,
  totalItemsCount = 0,
  columns: baseColumns,
  deleteMutationFn,
  entityName,
  rowActions,
  refetch,
  bulkActions: baseBulkActions,
  actionBarItems,
}: EntityListDataTableProps<Data, DeleteMInput, DeleteMOutput>) {
  const columnHelper = createColumnHelper<Data>();

  const router = useRouter();
  const pathname = usePathname();
  const { updateSearchParams, searchParams } = useRouterUtils();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 24;

  const totalPagesCount = Math.ceil(totalItemsCount / pageSize);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesCount) return;
    updateSearchParams({
      page: `${newPage}`,
    });
  };

  const { mutate: deleteMany, isPending } = useMutation({
    mutationFn: async (input: DeleteMInput) => {
      const data = await deleteMutationFn(input);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `${entityName.toLowerCase()}${variables.ids.length !== 1 ? "s" : ""} were deleted successfully`,
      );
      router.refresh();
    },
    onError: (_, variables) => {
      toast.error(
        `${entityName.toLowerCase()}${variables.ids.length !== 1 ? "s" : ""} weren't deleted successfully`,
      );
    },
  });

  const columns = React.useMemo(() => {
    const isFeaturedAssetExists = data.some((item) => item.featuredAsset);
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...(isFeaturedAssetExists
        ? [
            columnHelper.accessor<any, any>("featuredAsset", {
              header: "Featured Asset",
              cell: (info) => {
                if (
                  "featuredAsset" in info.row.original &&
                  info.row.original.featuredAsset
                ) {
                  return (
                    <AssetDisplay
                      containerClassName={`h-40 max-w-80`}
                      asset={info.row.original.featuredAsset}
                      image={{
                        transform: { preset: "small", mode: "resize" },
                        loading: "eager",
                        className: "size-full rounded-base object-contain",
                      }}
                    />
                  );
                }
                return null;
              },
            }),
          ]
        : []),

      ...baseColumns,
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <RowActions
              row={row}
              actions={[
                {
                  order: 100,
                  component: () => (
                    <ActionMenuItemWithConfirmation
                      content={
                        <React.Fragment>
                          <TrashIcon />
                          <span className={"capitalize"}>
                            Delete {entityName}
                          </span>
                        </React.Fragment>
                      }
                      confirm={`Are you sure you want to delete this ${entityName.toLowerCase()}?`}
                      disabled={isPending}
                      onExecute={() =>
                        deleteMany({
                          ids: [row.original.id],
                        } as DeleteMInput)
                      }
                    />
                  ),
                },
                {
                  order: 200,
                  component: () => (
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`${pathname}/${row.original.id}`)
                      }
                      className="capitalize"
                    >
                      <EditIcon />
                      <span> View/Edit {entityName}</span>
                    </DropdownMenuItem>
                  ),
                },
                ...(Array.isArray(rowActions) ? rowActions : []),
              ]}
            />
          );
        },
      },
    ] as ColumnDef<Data>[];
  }, [
    baseColumns,
    deleteMany,
    entityName,
    isPending,
    pathname,
    router.push,
    rowActions,
    data,
    columnHelper.accessor,
  ]);

  const bulkActions = React.useMemo(() => {
    return [
      {
        component: (props) => (
          <DeleteEntitiesBulkAction
            {...props}
            deleteMutationFn={deleteMutationFn}
            entityName={entityName}
          />
        ),
        order: 1,
      },
      ...(Array.isArray(baseBulkActions) ? baseBulkActions : []),
    ] satisfies EntityListBulkAction<Data[]>[];
  }, [baseBulkActions, deleteMutationFn, entityName]);

  return (
    <DataTable
      columns={columns as any}
      data={data}
      onClick={(row) => {
        row.toggleSelected(!row.getIsSelected());
      }}
      goToPage={goToPage}
      page={page}
      pageSize={pageSize}
      totalPagesCount={totalPagesCount}
      onPageSizeChange={(pageSize) => {
        updateSearchParams({
          pageSize: `${pageSize}`,
        });
      }}
      resetPage={() => {
        updateSearchParams({
          page: `${1}`,
        });
      }}
      refetch={refetch}
      bulkActions={bulkActions}
      actionBarItems={actionBarItems}
    />
  );
}

type EntityListInput<Data extends Array<{ id: string }>> = Array<
  Pick<Data[number], "id">
>;

export function DeleteEntitiesBulkAction<
  Data extends Array<{ id: string }>,
  DeleteMInput extends { ids: string[] },
  DeleteMOutput extends Array<DeletionResponse>,
>({
  selection,
  refetch,
  deleteMutationFn,
  entityName,
}: {
  selection: EntityListInput<Data>;
  refetch: () => void;
  deleteMutationFn: (input: DeleteMInput) => Promise<DeleteMOutput>;
  entityName: string;
}) {
  const selectionLength = selection.length;
  const { mutate } = useMutation({
    mutationFn: async (input: DeleteMInput) => {
      const data = await deleteMutationFn(input);
      return data;
    },
    onSuccess: (result: DeleteMOutput) => {
      if (result[0].result === "DELETED") {
        toast.success(
          `Deleted ${selectionLength} ${entityName.toLowerCase()}s`,
        );
      } else {
        const message = result[0].message;
        toast.error(`Failed to delete ${entityName}s: ${message}`);
      }
      refetch();
    },
    onError: () => {
      toast.error(
        `Failed to delete ${selectionLength} ${entityName.toLowerCase()}s`,
      );
    },
  });

  return (
    <ActionMenuItemWithConfirmation
      onExecute={() =>
        mutate({
          ids: selection.map((s) => s.id),
        } as DeleteMInput)
      }
      content={
        <React.Fragment>
          <TrashIcon />
          <span className="capitalize">delete {entityName}</span>
        </React.Fragment>
      }
      confirm={`Are you sure you want to delete ${selectionLength} ${entityName.toLowerCase()}s?`}
      keepMenuOpen={false}
    />
  );
}
