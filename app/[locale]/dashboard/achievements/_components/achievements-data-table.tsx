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
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type {
  Achievement,
  DeleteAchievementsInputSchema,
  DeleteAchievementsOutputSchema,
} from "@/lib/dto/achievement";

export const columns: ColumnDef<Achievement>[] = [];

export function AchievementsDataTable({
  achievements,
  totalItemsCount,
  pageSize = 24,
}: {
  achievements: Achievement[];
  totalItemsCount: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const { updateSearchParams, searchParams } = useRouterUtils();
  const [page, setPage] = React.useState(1);
  const columnHelper = createColumnHelper<Achievement>();

  const { mutate: deleteAchievements, isPending } = useMutation({
    mutationFn: async (input: DeleteAchievementsInputSchema) => {
      const res = await fetch("/api/achievements", {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as DeleteAchievementsOutputSchema;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Achievement${variables.ids.length !== 1 ? "s" : ""} were deleted successfully`,
      );
      router.refresh();
    },
    onError: (_, variables) => {
      toast.error(
        `Achievement${variables.ids.length !== 1 ? "s" : ""} weren't deleted successfully`,
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
      {
        accessorKey: "credentialUrl",
        header: "Credential URL",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <RowActions
              actions={[
                {
                  component: () => (
                    <ActionMenuItemWithConfirmation
                      label="Delete Achievement"
                      confirm={
                        "Are you sure you want to delete this achievement?"
                      }
                      icon={TrashIcon}
                      disabled={isPending}
                      onExecute={() =>
                        deleteAchievements({
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
                        router.push(
                          `/dashboard/achievements/${row.original.id}`,
                        )
                      }
                    >
                      <EditIcon />
                      View/Edit Achievement
                    </DropdownMenuItem>
                  ),
                },
              ]}
            />
          );
        },
      },
    ] as ColumnDef<Achievement>[];
  }, [columnHelper.accessor, router.push, deleteAchievements, isPending]);

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
      data={achievements}
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
