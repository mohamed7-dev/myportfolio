"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ActionMenuItemWithConfirmation } from "@/components/shared/action-menu-item-with-confirmation";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRouterUtils } from "@/hooks/use-router-utils";
import type { DeletionResponse } from "@/lib/dto/common";
import type { Project, SoftDeleteProjectsInputSchema } from "@/lib/dto/project";

export function ProjectsDataTable({
  projects,
  totalItemsCount,
}: {
  projects: Project[];
  totalItemsCount: number;
}) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Project>();
  const { updateSearchParams, searchParams } = useRouterUtils();

  const deleteProjects = async (
    input: SoftDeleteProjectsInputSchema & { softDelete: boolean },
  ) => {
    const res = await fetch(
      input.softDelete ? "/api/projects" : `/api/projects/${input.ids[0]}`,
      {
        method: "DELETE",
        credentials: "include",
        body: input.softDelete ? JSON.stringify(input) : undefined,
      },
    );

    const data = (await res.json()) as DeletionResponse[];
    return data;
  };

  const columns = React.useMemo(() => {
    return [
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
    ] as ColumnDef<Project>[];
  }, [columnHelper.accessor]);

  return (
    <EntityListDataTable
      data={projects}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="project"
      deleteMutationFn={(input) =>
        deleteProjects({ ...input, softDelete: false })
      }
      refetch={() => router.refresh()}
      rowActions={[
        {
          order: 300,
          component: ({ row }) => (
            <ActionMenuItemWithConfirmation
              content={
                <React.Fragment>
                  <TrashIcon />
                  <span className="capitalize">soft delete project</span>
                </React.Fragment>
              }
              confirm={`Are you sure you want to soft delete project?`}
              disabled={!!row.original.deletedAt || !!row.original.deletedAt}
              onExecute={() =>
                deleteProjects({
                  ids: [row.original.id],
                  softDelete: true,
                })
              }
            />
          ),
        },
      ]}
      actionBarItems={[
        {
          order: 100,
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
