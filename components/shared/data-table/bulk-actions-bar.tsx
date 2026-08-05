import { ChevronDownIcon } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type EntityListBulkActionContext<
  Selection extends Array<{ id: string }>,
> = {
  selection: Selection;
  refetch: () => void;
};

export type EntityListBulkActionComponent<
  Selection extends Array<{ id: string }>,
> = React.FunctionComponent<EntityListBulkActionContext<Selection>>;

export type EntityListBulkAction<Selection extends Array<{ id: string }>> = {
  order?: number;
  component: EntityListBulkActionComponent<Selection>;
};

interface EntityListDataTableBulkActionBarProps<
  Selection extends { id: string },
> {
  selection: Selection[];
  bulkActions?: EntityListBulkAction<Selection[]>[];
  refetch: () => void;
}

export function EntityListDataTableBulkActionBar<
  Selection extends { id: string },
>({
  bulkActions,
  selection,
  refetch,
}: EntityListDataTableBulkActionBarProps<Selection>) {
  const allBulkActions = [...(bulkActions ?? [])];
  allBulkActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));
  return (
    <div className="flex items-center gap-4 px-8 py-2 bg-secondary-background rounded-base border-2 border-border animate-in fade-in">
      <span className="text-sm text-muted-foreground">
        {selection.length} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="noShadow" size="sm" className="h-8 shadow-none">
            With selected...
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {allBulkActions.length > 0 ? (
            allBulkActions.map((action) => (
              <action.component
                key={`entity-list-bulk-action-${action.order}`}
                selection={selection}
                refetch={refetch}
              />
            ))
          ) : (
            <DropdownMenuItem className="text-muted-foreground" disabled>
              No actions available
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
