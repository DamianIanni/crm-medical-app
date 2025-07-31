"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const employeeTeamColumns: ColumnDef<User>[] = [
  {
    header: "Full name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
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
