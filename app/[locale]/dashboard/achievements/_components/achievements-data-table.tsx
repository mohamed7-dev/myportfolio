"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import type {
  Achievement,
  DeleteAchievementsInputSchema,
  DeleteAchievementsOutputSchema,
} from "@/lib/dto/achievement";

export function AchievementsDataTable({
  achievements,
  totalItemsCount,
}: {
  achievements: Achievement[];
  totalItemsCount: number;
}) {
  const router = useRouter();

  const deleteAchievements = async (input: DeleteAchievementsInputSchema) => {
    const res = await fetch("/api/achievements", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(input),
    });

    const data = (await res.json()) as DeleteAchievementsOutputSchema;
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
      {
        accessorKey: "credentialUrl",
        header: "Credential URL",
      },
    ] as ColumnDef<Achievement>[];
  }, []);

  return (
    <EntityListDataTable
      data={achievements}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="achievement"
      deleteMutationFn={deleteAchievements}
      refetch={() => router.refresh()}
    />
  );
}
