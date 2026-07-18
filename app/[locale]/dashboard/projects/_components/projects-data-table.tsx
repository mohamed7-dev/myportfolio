"use client";
import { useMutation } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { BinaryIcon, MoreHorizontal, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { AssetDisplay } from "@/components/shared/assets/asset-display";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type { DeletionResponse } from "@/lib/dto/common";
import type { DeleteProjectsInputSchema, Project } from "@/lib/dto/project";

export const columns: ColumnDef<Project>[] = [];

export function ProjectsDataTable({
  projects,
  totalItemsCount,
  pageSize = 24,
}: {
  projects: Project[];
  totalItemsCount: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const { updateSearchParams, searchParams } = useRouterUtils();
  const [page, setPage] = React.useState(1);
  const columnHelper = createColumnHelper<Project>();

  // Delete Project
  const { mutate: deleteProjects, isPending } = useMutation({
    mutationFn: async (
      input: DeleteProjectsInputSchema & { softDelete: boolean },
    ) => {
      const res = await fetch(
        input.softDelete ? "/api/projects" : `/api/projects/${input.ids[0]}`,
        {
          method: "DELETE",
          credentials: "include",
          body: input.softDelete ? JSON.stringify(input) : undefined,
        },
      );

      const data = (await res.json()) as DeletionResponse[] | DeletionResponse;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Project${variables.ids.length !== 1 ? "s" : ""} were deleted successfully`,
      );
      router.refresh();
    },
    onError: (_, variables) => {
      toast.error(
        `Project${variables.ids.length !== 1 ? "s" : ""} weren't deleted successfully`,
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
      columnHelper.accessor("featuredAsset.sourceIdentifier", {
        header: "Featured Asset",
        cell: (info) => {
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
        },
      }),
      {
        accessorKey: "name",
        header: "Name",
      },
      columnHelper.accessor("deletedAt", {
        header: "Soft Deleted?",
        cell: (info) => {
          if (info.getValue() === null) {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                No
              </Badge>
            );
          } else {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                Yes
              </Badge>
            );
          }
        },
      }),
      columnHelper.accessor("enabled", {
        header: "Status",
        cell: (info) => {
          if (info.getValue() === true) {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                Enabled
              </Badge>
            );
          } else {
            return (
              <Badge className="text-xs font-normal" variant={"neutral"}>
                Disabled
              </Badge>
            );
          }
        },
      }),
      columnHelper.accessor("repoUrl", {
        header: "Repo URL",
        cell: (info) => {
          return (
            <Link href={info.getValue()} target="_blank" className="underline">
              {info.getValue()}
            </Link>
          );
        },
      }),
      columnHelper.accessor("liveDemoUrl", {
        header: "Live Demo URL",
        cell: (info) => {
          return (
            <Link href={info.getValue()} target="_blank" className="underline">
              {info.getValue()}
            </Link>
          );
        },
      }),
      {
        id: "actions",
        cell: ({ row }) => {
          // TODO: add dropdown menu items for un-soft delete and delete

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="neutralNoShadow" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[18rem]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    deleteProjects({ ids: [row.original.id], softDelete: true })
                  }
                  disabled={
                    (isPending && !!row.original.deletedAt) ||
                    !!row.original.deletedAt
                  }
                >
                  Soft Delete Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteProjects({
                      ids: [row.original.id],
                      softDelete: false,
                    })
                  }
                  disabled={isPending && !row.original.deletedAt}
                >
                  Delete Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/projects/${row.original.id}`)
                  }
                >
                  View/Edit Project Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ] as ColumnDef<Project>[];
  }, [columnHelper.accessor, router.push, deleteProjects, isPending]);

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
      data={projects}
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
      actionBarItems={[
        {
          component: () => (
            <Field orientation={"horizontal"}>
              <Checkbox
                id="soft-deleted-items-control"
                checked={searchParams.get("includeSoftDeleted") === "true"}
                onCheckedChange={(checked) => {
                  updateSearchParams({
                    includeSoftDeleted: String(checked),
                  });
                }}
              />
              <FieldLabel htmlFor="soft-deleted-items-control">
                Include soft deleted?
              </FieldLabel>
            </Field>
          ),
          id: "soft-deleted-items-control",
        },
      ]}
    />
  );
}
