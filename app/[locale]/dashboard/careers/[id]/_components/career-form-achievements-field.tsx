"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { EntityRelation } from "@/components/data-input/entity-relation";
import { Field, FieldLabel } from "@/components/ui/field";
import type { AchievementListOutputSchema } from "@/lib/dto/achievement";
import { isAppError } from "@/lib/errors/app-error";
import { api } from "@/lib/helpers/api";
import { apiRoutes } from "@/lib/helpers/router";

export function CareerFormAchievementsField() {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);

  const queryFn = async (
    page: number,
    pageSize: number,
    searchTerm: string,
  ) => {
    const filter: Record<string, any> = {};

    if (searchTerm) {
      filter.name = {
        contains: searchTerm,
      };
    }

    const options: any = {
      skip: (page - 1) * pageSize,
      take: pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    };

    const searchParams = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      key === "filter"
        ? searchParams.set("filter", JSON.stringify(value))
        : searchParams.set(key, typeof value === "string" ? value : `${value}`);
    });

    const res = await api(
      {
        ...apiRoutes.achievements.list,
        url: apiRoutes.achievements.list.url(searchParams),
      },
      undefined,
      true,
    );

    const data = await res.json();
    if (isAppError(data)) {
      // we should display the error to the UI, not throwing it
      throw data;
    } else {
      const successResult = data as AchievementListOutputSchema;
      return {
        items: successResult.items.map((item) => ({
          ...item,
          label: item.name,
        })),
        totalItemsCount: successResult.itemsCount,
      };
    }
  };

  return (
    <Field>
      <FieldLabel>Achievement</FieldLabel>
      <EntityRelation
        queryFn={queryFn}
        selectedIds={form.watch("achievementIds")}
        entityName="achievement"
        searchLabel="Search by achievement name"
        open={open}
        onOpenChange={setOpen}
        onSelectChange={(achievementIds) => {
          form.setValue("achievementIds", achievementIds, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </Field>
  );
}
