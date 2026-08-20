import { queryOptions } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";

export const getRelationFieldDataQueryOptions = <
  QueryFnInput extends { label: string },
  QueryFnOutput extends Array<Item>,
>({
  queryKey,
  queryFn,
}: {
  queryKey: string[];
  queryFn: (input: QueryFnInput) => Promise<QueryFnOutput>;
}) =>
  queryOptions({
    queryKey: queryKey,
    queryFn: queryFn as any,
  });

type Item = { id: string; label: string };

interface RelationFieldProps<Data extends Item> {
  selectedIds: string[];
  onSelectChange: (value: string) => void;
  entityName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Data[];
}

export function RelationField<Data extends Item>({
  selectedIds,
  onSelectChange,
  entityName,
  open,
  onOpenChange,
  data,
}: RelationFieldProps<Data>) {
  const labels = data
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.label);
  const hasSelectedIds =
    selectedIds.filter((item) => notNullOrUndefined(item) && item.length > 0)
      .length > 0;
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="noShadow"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
        >
          {hasSelectedIds ? labels.join(", ") : `Select ${entityName}`}
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 border-0! p-0 font-base">
        <Command>
          <CommandInput placeholder={`Search ${entityName}...`} />
          <CommandEmpty>No {entityName}s found.</CommandEmpty>
          <CommandGroup>
            {data?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={(currentValue) => {
                  onSelectChange(currentValue);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 size-4",
                    selectedIds.includes(item.id) ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
