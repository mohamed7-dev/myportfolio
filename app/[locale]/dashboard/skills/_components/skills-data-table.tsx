"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import { Badge } from "@/components/ui/badge";
import type {
  DeleteSkillsInputSchema,
  DeleteSkillsOutputSchema,
  Skill,
} from "@/lib/dto/skill";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

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
    const res = await api(apiRoutes.skills.delete, input, true);
    const data = (await res.json()) as DeleteSkillsOutputSchema;
    if (isAppError(data)) {
      throw data;
    }
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
