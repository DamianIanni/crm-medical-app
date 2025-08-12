"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import Actions from "@/components/tables/actions";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const managerTeamColumns: ColumnDef<DataUserFilter>[] = [
  {
    header: "Full name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return <TableCellFallback value={treatment} fallback="No info" />;
    },
    id: "fullName",
  },
  { accessorKey: "email", header: "Email" },
  // { accessorKey: "organization", header: "Organization" },
  {
    id: "actions",
    header: () => <div className="text-right min-w-[100px]"></div>,
    cell: ({ row }) => {
      const member = row.original;

      return <Actions data={member} route="team" />;
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    enableSorting: false,
    enableResizing: false,
  },
];
