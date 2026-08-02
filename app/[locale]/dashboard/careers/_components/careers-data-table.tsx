"use client";
import { useMutation } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { ActionMenuItemWithConfirmation } from "@/components/shared/action-menu-item-with-confirmation";
import { AssetDisplay } from "@/components/shared/assets/asset-display";
import { DataTable } from "@/components/shared/data-table/data-table";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type {
  Career,
  DeleteCareersInputSchema,
  DeleteCareersOutputSchema,
} from "@/lib/dto/career";

export const columns: ColumnDef<Career>[] = [];

export function CareerDataTable({
  careers,
  totalItemsCount,
  pageSize = 24,
}: {
  careers: Career[];
  totalItemsCount: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const { updateSearchParams, searchParams } = useRouterUtils();
  const [page, setPage] = React.useState(1);
  const columnHelper = createColumnHelper<Career>();

  const { mutate: deleteCareers, isPending } = useMutation({
    mutationFn: async (input: DeleteCareersInputSchema) => {
      const res = await fetch("/api/careers", {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as DeleteCareersOutputSchema;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Career${variables.ids.length !== 1 ? "s" : ""} were deleted successfully`,
      );
      router.refresh();
    },
    onError: (_, variables) => {
      toast.error(
        `Career${variables.ids.length !== 1 ? "s" : ""} weren't deleted successfully`,
      );
    },
  });

  const columns = React.useMemo(() => {
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
      columnHelper.accessor("featuredAsset", {
        header: "Featured Asset",
        cell: (info) => {
          if (info.row.original.featuredAsset) {
            return (
              <AssetDisplay
                asset={info.row.original.featuredAsset}
                image={{
                  width: 150,
                  height: 150,
                  className: "rounded-base object-cover",
                }}
              />
            );
          }
          return null;
        },
      }),
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "organization",
        header: "Organization",
      },

      columnHelper.accessor("isPresent", {
        header: "Is Present?",
        cell: (info) => {
          if (info.getValue() === true) {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                True
              </Badge>
            );
          } else {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                False
              </Badge>
            );
          }
        },
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: (info) => {
          return <p>{info.getValue().toLocaleDateString()}</p>;
        },
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        cell: (info) => {
          return <p>{info.getValue()?.toLocaleDateString() || "NULL"}</p>;
        },
      }),
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <RowActions
              actions={[
                {
                  component: () => (
                    <ActionMenuItemWithConfirmation
                      label="Delete Career"
                      confirm={"Are you sure you want to delete career?"}
                      icon={TrashIcon}
                      disabled={isPending}
                      onExecute={() =>
                        deleteCareers({
                          ids: [row.original.id],
                        })
                      }
                    />
                  ),
                },
                {
                  component: () => (
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/careers/${row.original.id}`)
                      }
                    >
                      <EditIcon />
                      View/Edit Career Details
                    </DropdownMenuItem>
                  ),
                },
              ]}
            />
          );
        },
      },
    ] as ColumnDef<Career>[];
  }, [columnHelper.accessor, router.push, deleteCareers, isPending]);

  // Pagination
  const totalItems = totalItemsCount || 0;
  const totalPagesCount = Math.ceil(totalItems / pageSize);
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesCount) return;
    setPage(newPage);
  };

  return (
    <DataTable
      columns={columns}
      data={careers}
      onClick={(row) => {
        // select
      }}
      goToPage={goToPage}
      page={page}
      totalPagesCount={totalPagesCount}
      pageSize={pageSize}
      onPageSizeChange={(pageSize) => {
        updateSearchParams({
          pageSize: `${pageSize}`,
        });
      }}
      resetPage={() => setPage(0)}
    />
  );
}
