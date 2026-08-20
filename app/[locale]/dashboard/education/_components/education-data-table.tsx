"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import { Badge } from "@/components/ui/badge";
import type {
  DeleteEducationsInputSchema,
  DeleteEducationsOutputSchema,
  Education,
} from "@/lib/dto/education";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

export function EducationDataTable({
  education,
  totalItemsCount,
}: {
  education: Education[];
  totalItemsCount: number;
}) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Education>();

  const deleteEducation = async (input: DeleteEducationsInputSchema) => {
    const res = await api(apiRoutes.education.delete, input, true);

    const data = (await res.json()) as DeleteEducationsOutputSchema;
    if (isAppError(data)) {
      throw data;
    }
    return data;
  };

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "school",
        header: "School",
      },
      {
        accessorKey: "degree",
        header: "Degree",
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
    ] as ColumnDef<Education>[];
  }, [columnHelper.accessor]);

  return (
    <EntityListDataTable
      data={education}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="education item"
      deleteMutationFn={deleteEducation}
      refetch={() => router.refresh()}
    />
  );
}
