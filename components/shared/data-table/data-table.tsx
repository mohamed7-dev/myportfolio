import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Row,
  type Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type EntityListBulkAction,
  EntityListDataTableBulkActionBar,
} from "./bulk-actions-bar";
import { PaginationBar } from "./pagination-bar";

export type DataTableActionBarItemContext<TData> = {
  table: TanstackTable<TData>;
};

export type DataTableActionBarItemComponent<TData> = React.FunctionComponent<
  DataTableActionBarItemContext<TData>
>;

export interface DataTableActionBarItem<TData> {
  component: DataTableActionBarItemComponent<TData>;
  id: string;
  order?: number;
}

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onClick(row: Row<TData>, event: React.MouseEvent): void;
  goToPage: (page: number) => void;
  page: number;
  totalPagesCount: number;
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  resetPage: () => void;
  actionBarItems?: Array<DataTableActionBarItem<TData>>;
  bulkActions?: EntityListBulkAction<TData[]>[];
  refetch: () => void;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onClick,
  goToPage,
  page,
  totalPagesCount,
  pageSize,
  onPageSizeChange,
  resetPage,
  actionBarItems,
  bulkActions,
  refetch,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isSelected = table.getSelectedRowModel().flatRows.length > 0;

  const allActionBarItems = [...(actionBarItems ?? [])];
  allActionBarItems.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden space-y-2">
        {isSelected && (
          <EntityListDataTableBulkActionBar
            bulkActions={bulkActions}
            selection={table
              .getSelectedRowModel()
              .flatRows.map((row) => row.original)}
            refetch={refetch}
          />
        )}
        <div className="w-full flex items-center justify-between">
          <div />
          <div className="">
            {allActionBarItems?.map((item) => (
              <item.component key={item.id} table={table} />
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => onClick(row, e)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationBar
        goToPage={goToPage}
        totalPagesCount={totalPagesCount}
        page={page}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        resetPage={resetPage}
      />
    </div>
  );
}
