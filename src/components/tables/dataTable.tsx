"use client";

import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  Table as TanstackTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const ROW_HEIGHT_PX = 52;

function useDynamicPageSize(
  containerRef: React.RefObject<HTMLDivElement>,
  defaultSize = 10
) {
  const [pageSize, setPageSize] = useState(defaultSize);
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const height = containerRef.current?.clientHeight ?? 0;
      const rows = Math.floor((height - 52) / ROW_HEIGHT_PX);
      setPageSize(rows > 0 ? rows : 1);
    };
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    updateSize();
    return () => resizeObserver.disconnect();
  }, [containerRef, defaultSize]);
  return pageSize;
}

// 1. The props interface now has 'table' as optional.
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  table?: TanstackTable<TData>; // The parent table instance is optional
  searchTerm?: string;
  totalItems?: number;
  setSearchTerm?: (term: string) => void;
  onPageSizeChange?: (size: number) => void;
}

export const DataTable = ({
  columns,
  data,
  table: serverSideTable, // Renamed the prop for clarity
  searchTerm,
  totalItems,
  setSearchTerm,
  onPageSizeChange,
}: DataTableProps<any, any>) => {
  const t = useTranslations("Table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = internalRef;
  // Determine the operation mode
  const isServerSide = !!serverSideTable;
  const clientSideTable = useReactTable({
    data,
    columns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const table = isServerSide ? serverSideTable : clientSideTable;

  const dynamicPageSize = useDynamicPageSize(
    containerRef,
    table.getState().pagination.pageSize
  );

  useEffect(() => {
    if (isServerSide && onPageSizeChange) {
      onPageSizeChange(dynamicPageSize);
    }
  }, [dynamicPageSize, isServerSide, onPageSizeChange]);

  // If we're in client mode, update the table state directly.
  useEffect(() => {
    if (!isServerSide) {
      table.setPageSize(dynamicPageSize);
    }
  }, [dynamicPageSize, isServerSide, table]);

  const currentSearch = isServerSide ? searchTerm : globalFilter;
  const handleSearchChange = isServerSide ? setSearchTerm : setGlobalFilter;
  const _totalItems = isServerSide ? totalItems : table.options.data.length;

  return (
    <div className="w-full h-full flex flex-col overflow-x-auto rounded-xl bg-sidebar">
      <div className=" px-4 py-4 flex items-center justify-between">
        <Input
          placeholder={t("search")}
          value={currentSearch || ""}
          onChange={(e) => handleSearchChange?.(e.target.value)}
          className="max-w-xs"
        />
        <div className="text-sm text-muted-foreground">
          {_totalItems} {t("items", { count: _totalItems! })}
        </div>
      </div>

      <div ref={containerRef} className="flex-grow w-full overflow-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="cursor-pointer bg-muted h-13"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<any>) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-13">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-auto flex items-center justify-between px-2 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          {t("pageNumber", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("previous")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("next")}
          </Button>
        </div>
      </div>
    </div>
  );
};
DataTable.displayName = "DataTable";
