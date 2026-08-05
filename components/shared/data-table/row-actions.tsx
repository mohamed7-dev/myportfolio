import type { Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DataTableRowActionContext<TData> = {
  row: Row<TData>;
};

export type DataTableRowActionComponent<TData> = React.FunctionComponent<
  DataTableRowActionContext<TData>
>;

export type RowAction<TData> = {
  order?: number;
  component: DataTableRowActionComponent<TData>;
};

interface RowActionsProps<TData> {
  actions?: RowAction<TData>[];
  row: Row<TData>;
}

export function RowActions<TData>({ actions, row }: RowActionsProps<TData>) {
  const allActions = [...(actions ?? [])];
  allActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="neutralNoShadow" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[18rem]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {allActions.length > 0 ? (
          allActions.map((action) => (
            <action.component key={`row-action-${action.order}`} row={row} />
          ))
        ) : (
          <DropdownMenuItem className="text-foreground/70" disabled>
            No actions available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
