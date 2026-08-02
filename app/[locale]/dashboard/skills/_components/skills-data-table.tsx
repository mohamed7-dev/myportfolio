"use client";
import { useMutation } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { AnchorIcon, EditIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { AssetDisplay } from "@/components/shared/assets/asset-display";
import { DataTable } from "@/components/shared/data-table/data-table";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type { DeletionResponse } from "@/lib/dto/common";
import type { DeleteSkillsInputSchema, Skill } from "@/lib/dto/skill";
import { DeleteRowAction } from "./delete-row-action";

export const columns: ColumnDef<Skill>[] = [];

export function SkillsDataTable({
  skills,
  totalItemsCount,
  pageSize = 24,
}: {
  skills: Skill[];
  totalItemsCount: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const { updateSearchParams } = useRouterUtils();
  const [page, setPage] = React.useState(1);
  const columnHelper = createColumnHelper<Skill>();

  // Delete Project
  const { mutate: deleteSkills, isPending } = useMutation({
    mutationFn: async (input: DeleteSkillsInputSchema) => {
      const res = await fetch("/api/skills", {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(input),
      });

      const data = (await res.json()) as DeletionResponse[];
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Skill${variables.ids.length !== 1 ? "s" : ""} were deleted successfully`,
      );
      router.refresh();
    },
    onError: (_, variables) => {
      toast.error(
        `Skill${variables.ids.length !== 1 ? "s" : ""} weren't deleted successfully`,
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
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => {
          return (
            <Badge className="text-xs font-normal" variant={"neutral"}>
              {info.row.original.category}
            </Badge>
          );
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
                    <DeleteRowAction
                      label="Delete Skill"
                      confirm={"Are you sure you want to delete skill?"}
                      icon={TrashIcon}
                      disabled={isPending}
                      onExecute={() => {
                        deleteSkills({
                          ids: [row.original.id],
                        });
                      }}
                    />
                  ),
                },
                {
                  component: () => (
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/skills/${row.original.id}`)
                      }
                    >
                      <EditIcon /> View/Edit Skill Details
                    </DropdownMenuItem>
                  ),
                },
              ]}
            />
          );
        },
      },
    ] as ColumnDef<Skill>[];
  }, [columnHelper.accessor, router.push, deleteSkills, isPending]);

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
      data={skills}
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
