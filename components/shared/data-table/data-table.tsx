import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Row,
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
import { PaginationBar } from "./pagination-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onClick(row: Row<TData>, event: React.MouseEvent): void;
  goToPage: (page: number) => void;
  page: number;
  totalPagesCount: number;
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  resetPage: () => void;
  actionBarItems?: [
    {
      component: React.FunctionComponent;
      id: string;
    },
  ];
}

export function DataTable<TData, TValue>({
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
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden space-y-2">
        <div className="w-full flex items-center justify-between">
          <div />
          <div className="">
            {actionBarItems?.map((item) => (
              <item.component key={item.id} />
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
