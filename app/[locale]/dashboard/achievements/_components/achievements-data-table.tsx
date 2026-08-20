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
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

export function AchievementsDataTable({
  achievements,
  totalItemsCount,
}: {
  achievements: Achievement[];
  totalItemsCount: number;
}) {
  const router = useRouter();

  const deleteAchievements = async (input: DeleteAchievementsInputSchema) => {
    const res = await api(apiRoutes.achievements.delete, input, true);
    const data = (await res.json()) as DeleteAchievementsOutputSchema;
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
