// /* eslint-disable react-hooks/exhaustive-deps */
// /**
//  * @file DataTable.tsx
//  * @summary This file provides a generic DataTable component built with TanStack Table.
//  * It offers features such as sorting, filtering, and pagination for displaying tabular data,
//  * making it a versatile component for various data presentation needs.
//  */

// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useTranslations } from "next-intl";
// import React from "react";

// const ROW_HEIGHT_PX = 52;

// function useDynamicPageSize(defaultSize = 10) {
//   const containerRef = React.useRef<HTMLDivElement>(null);
//   const [pageSize, setPageSize] = React.useState(defaultSize);

//   React.useLayoutEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     function updateSize() {
//       const height = el?.clientHeight;
//       const rows = Math.floor(height! / ROW_HEIGHT_PX);
//       setPageSize(rows > 0 ? rows : defaultSize);
//     }

//     const resizeObserver = new ResizeObserver(updateSize);
//     resizeObserver.observe(el);
//     updateSize();

//     return () => resizeObserver.disconnect();
//   }, []);

//   return { pageSize, containerRef };
// }

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// /**
//  * DataTable component.
//  * A generic and reusable table component that leverages TanStack Table for advanced features
//  * like sorting, filtering, and pagination. It dynamically renders columns and rows based on
//  * the provided `columns` and `data` props.
//  */
// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>): React.ReactElement {
//   const t = useTranslations("Table");
//   // State to manage the sorting configuration of the table.
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const { pageSize, containerRef } = useDynamicPageSize();

//   /**
//    * Initializes the TanStack Table instance.
//    * Configures the table with data, columns, sorting state, and various model accessors
//    * for core functionality, sorting, filtering, and pagination.
//    */
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize,
//   });

//   React.useEffect(() => {
//     setPagination((prev) => ({ ...prev, pageSize }));
//   }, [pageSize]);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       pagination,
//     },
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="w-full h-full flex flex-col overflow-x-auto rounded-xl bg-sidebar ">
//       <div className="px-2 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//         {/* Input field for global filtering. Currently filters by 'email' column. */}
//         <Input
//           placeholder={t("search")}
//           value={String(table.getState().columnFilters[0]?.value ?? "")}
//           onChange={(e) =>
//             table.setColumnFilters([{ id: "email", value: e.target.value }])
//           }
//           className="max-w-xs"
//         />
//         {/* Displays the count of filtered items. */}
//         <div className="text-sm text-muted-foreground px-4">
//           {table.getFilteredRowModel().rows.length}{" "}
//           {t("items", { count: table.getFilteredRowModel().rows.length })}
//         </div>
//       </div>

//       {/* Main table structure */}

//       {/* <Table className="w-full min-w-[700px] "> */}
//       <div
//         ref={containerRef}
//         className="w-full  h-full flex flex-col overflow-x-auto  bg-sidebar"
//       >
//         <Table className="w-full min-w-[700px] ">
//           <TableHeader>
//             {/* Renders table headers based on column definitions, enabling sorting on click. */}
//             {table.getHeaderGroups().map((hg) => (
//               <TableRow key={hg.id} className="bg-muted">
//                 {hg.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()} // Toggles sorting for the column.
//                     className="min-w-[100px] text-md font-semibold "
//                   >
//                     {/* Renders the header content. */}
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {/* Conditionally renders table rows if data is available, otherwise displays "No results." */}
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} className="even:bg-muted/40">
//                   {/* Renders cells for each visible row. */}
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="min-w-[120px] h-13">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center text-muted-foreground"
//                 >
//                   {t("noResults")}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination controls */}
//       <div className="mt-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-2 py-4">
//         {/* Displays current page number and total page count. */}
//         <div className="text-sm text-muted-foreground">
//           {t("pageNumber", {
//             current: table.getState().pagination.pageIndex + 1,
//             total: table.getPageCount(),
//           })}
//         </div>
//         <div className="flex gap-2">
//           {/* Button to navigate to the previous page. */}
//           <Button
//             className="hover:cursor-pointer"
//             size="sm"
//             variant="outline"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             {t("previous")}
//           </Button>
//           {/* Button to navigate to the next page. */}
//           <Button
//             className="hover:cursor-pointer"
//             size="sm"
//             variant="outline"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             {t("next")}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

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

// El hook ahora vive aquí de nuevo, donde pertenece.
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

// 1. La interfaz de props ahora tiene 'table' como opcional.
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  table?: TanstackTable<TData>; // La instancia de la tabla del padre es opcional
  searchTerm?: string;
  totalItems?: number;
  setSearchTerm?: (term: string) => void;
  onPageSizeChange?: (size: number) => void;
}

export const DataTable = ({
  columns,
  data,
  table: serverSideTable, // Renombramos la prop para claridad
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
  // Determina el modo de operación
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

  // Si estamos en modo cliente, actualizamos el estado de la tabla directamente.
  useEffect(() => {
    if (!isServerSide) {
      table.setPageSize(dynamicPageSize);
    }
  }, [dynamicPageSize, isServerSide, table]);

  // 2. Creamos una instancia de tabla para el MODO CLIENTE.
  //    Los hooks deben llamarse siempre, así que la definimos aquí.

  // Ajuste dinámico del tamaño de página (SOLO para modo cliente)
  // useLayoutEffect(() => {
  //   if (isServerSide || !containerRef.current) return;
  //   const updateSize = () => {
  //     const height = containerRef.current?.clientHeight ?? 0;
  //     const rows = Math.floor(height / ROW_HEIGHT_PX);
  //     setPagination((prev) => ({ ...prev, pageSize: rows > 0 ? rows : 1 }));
  //   };
  //   const resizeObserver = new ResizeObserver(updateSize);
  //   resizeObserver.observe(containerRef.current);
  //   updateSize();
  //   return () => resizeObserver.disconnect();
  // }, [isServerSide, containerRef]);

  // 3. LA LÓGICA CONDICIONAL:
  //    Usa la tabla del padre si existe, si no, usa la que creamos para el modo cliente.

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
