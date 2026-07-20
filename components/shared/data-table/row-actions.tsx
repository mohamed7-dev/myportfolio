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

export type AssetBulkActionComponent = React.FunctionComponent;

export type RowAction = {
  order?: number;
  component: AssetBulkActionComponent;
};

interface RowActionsProps {
  actions?: RowAction[];
}

export function RowActions({ actions }: RowActionsProps) {
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
          allActions.map((action, index) => (
            <action.component
              key={`row-action-${
                // biome-ignore lint/suspicious/noArrayIndexKey: no other key available
                index
              }`}
            />
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
