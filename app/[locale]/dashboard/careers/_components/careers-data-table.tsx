"use client";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import { Badge } from "@/components/ui/badge";
import type {
  Career,
  DeleteCareersInputSchema,
  DeleteCareersOutputSchema,
} from "@/lib/dto/career";

export function CareerDataTable({
  careers,
  totalItemsCount,
}: {
  careers: Career[];
  totalItemsCount: number;
}) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Career>();

  const deleteCareers = async (input: DeleteCareersInputSchema) => {
    const res = await fetch("/api/careers", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(input),
    });

    const data = (await res.json()) as DeleteCareersOutputSchema;
    return data;
  };

  const columns = React.useMemo(() => {
    return [
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
    ] as ColumnDef<Career>[];
  }, [columnHelper.accessor]);

  return (
    <EntityListDataTable
      data={careers}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="career"
      deleteMutationFn={deleteCareers}
      refetch={() => router.refresh()}
    />
  );
}
