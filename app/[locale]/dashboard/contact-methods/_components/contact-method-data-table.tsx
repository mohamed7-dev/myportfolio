"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { EntityListDataTable } from "@/components/shared/data-table/entity-list-data-table";
import type {
  ContactMethod,
  DeleteContactMethodsInputSchema,
  DeleteContactMethodsOutputSchema,
} from "@/lib/dto/contact-method";

export function ContactMethodDataTable({
  contactMethods,
  totalItemsCount,
}: {
  contactMethods: ContactMethod[];
  totalItemsCount: number;
}) {
  const router = useRouter();

  const deleteContactMethods = async (
    input: DeleteContactMethodsInputSchema,
  ) => {
    const res = await fetch("/api/contact-methods", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(input),
    });

    const data = (await res.json()) as DeleteContactMethodsOutputSchema;
    return data;
  };

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "url",
        header: "URL",
      },
    ] as ColumnDef<ContactMethod>[];
  }, []);

  return (
    <EntityListDataTable
      data={contactMethods}
      columns={columns}
      totalItemsCount={totalItemsCount}
      entityName="contact method"
      deleteMutationFn={deleteContactMethods}
      refetch={() => router.refresh()}
    />
  );
}
