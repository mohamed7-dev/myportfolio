import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import { PaginationBar } from "../shared/data-table/pagination-bar";

type Item = { id: string; label: string };

export type EntityList = { items: Item[]; totalItemsCount: number };

interface EntityRelationProps<Data extends EntityList> {
  selectedIds: string[];
  onSelectChange: (value: string) => void;
  entityName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryFn: (
    page: number,
    pageSize: number,
    searchTerm: string,
  ) => Promise<Data>;
  defaultPageSize?: number;
  searchLabel?: string;
}

export function EntityRelation<Data extends EntityList>({
  selectedIds,
  onSelectChange,
  entityName,
  open,
  onOpenChange,
  queryFn,
  defaultPageSize,
  searchLabel,
}: EntityRelationProps<Data>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize ?? 12);
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const queryKey = [entityName, page, pageSize, debouncedSearch];

  const { data, isLoading: isPending } = useQuery({
    enabled: open,
    queryKey,
    queryFn: async () => {
      return await queryFn(page, pageSize, debouncedSearch);
    },
  });

  const labels =
    data?.items
      ?.filter((item) => selectedIds.includes(item.id))
      .map((item) => item.label) ?? [];

  const hasSelectedIds =
    selectedIds.filter((item) => notNullOrUndefined(item) && item.length > 0)
      .length > 0;

  const totalItemsCount = data?.totalItemsCount || 0;

  const totalPagesCount = Math.ceil(totalItemsCount / pageSize);

  const resetPage = () => {
    setPage(1);
  };

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const goToPage = (page: number) => {
    setPage(page);
  };

  return (
    <div>
      <Button
        type="button"
        variant="noShadow"
        role="combobox"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
      >
        {hasSelectedIds ? labels.join(", ") : `Select ${entityName}`}
        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        className="max-w-fit!"
        shouldFilter={false}
      >
        <CommandInput
          placeholder={
            searchLabel
              ? searchLabel
              : `${debouncedSearch && isPending ? "Searching" : "Search"} ${entityName}s...`
          }
          value={searchInput}
          onValueChange={setSearchInput}
          disabled={isPending}
        />
        {!data?.items?.length && (
          <CommandEmpty>No {entityName}s found.</CommandEmpty>
        )}
        {!data?.items?.length && isPending && (
          <div className="w-full h-20 flex justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
        <CommandGroup>
          {data?.items?.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={(currentValue) => {
                onSelectChange(currentValue);
              }}
              disabled={isPending}
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
        <div className="p-2 border-t-2 border-border">
          <PaginationBar
            pageSize={pageSize}
            totalPagesCount={totalPagesCount}
            page={page}
            goToPage={goToPage}
            onPageSizeChange={onPageSizeChange}
            resetPage={resetPage}
            containerClassName="gap-4"
          />
        </div>
      </CommandDialog>
    </div>
  );
}
