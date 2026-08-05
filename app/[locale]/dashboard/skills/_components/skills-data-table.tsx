"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import { Badge } from "@/components/ui/badge";
import type { DeletionResponse } from "@/lib/dto/common";
import type { DeleteSkillsInputSchema, Skill } from "@/lib/dto/skill";

export function SkillsDataTable({
  skills,
  totalItemsCount,
}: {
  skills: Skill[];
  totalItemsCount: number;
}) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Skill>();

  const deleteSkills = async (input: DeleteSkillsInputSchema) => {
    const res = await fetch("/api/skills", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(input),
    });

    const data = (await res.json()) as DeletionResponse[];
    return data;
  };

  const columns = React.useMemo(() => {
    return [
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
    ] as ColumnDef<Skill>[];
  }, [columnHelper.accessor]);

  return (
    <EntityListDataTable
      data={skills}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="skill"
      deleteMutationFn={deleteSkills}
      refetch={() => router.refresh()}
    />
  );
}
