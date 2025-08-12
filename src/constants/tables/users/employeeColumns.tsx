"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const employeeTeamColumns: ColumnDef<DataUserFilter>[] = [
  {
    header: "Full name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return <TableCellFallback value={treatment} fallback="No info" />;
    },
    id: "fullName",
  },
  { accessorKey: "surname", header: "Surname" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "organization", header: "Organization" },
];
