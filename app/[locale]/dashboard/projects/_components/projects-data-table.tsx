"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
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
import type { Project } from "@/lib/dto/project";

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
  const params = useParams();
  const [page, setPage] = React.useState(1);
  const columnHelper = createColumnHelper<Project>();
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
        cell: (info) => (
          <Image
            src={info.getValue()}
            alt={info.row.getValue("name")}
            width={150}
            height={150}
            className="rounded-base object-cover"
          />
        ),
      }),
      {
        accessorKey: "name",
        header: "Name",
      },
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
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="neutralNoShadow" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}}>
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
  }, [columnHelper.accessor, router.push]);

  // Pagination
  const totalItems = totalItemsCount || 0;
  const totalPagesCount = Math.ceil(totalItems / pageSize);
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPagesCount) return;
    setPage(newPage);
  };

  const onPageSizeChange = (pageSize: number) => {
    router.push(`/dashboard/projects?pageSize=${pageSize}`);
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
      onPageSizeChange={onPageSizeChange}
      resetPage={() => setPage(0)}
    />
  );
}
