"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/patient";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const employeePatientsColumns: ColumnDef<Patient>[] = [
  {
    header: "Full name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return <TableCellFallback value={treatment} fallback="No info" />;
    },
    id: "fullName",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "short_escription",
    header: "Diagnosis",
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return (
        <TableCellFallback value={treatment} fallback="No treatment info" />
      );
    },
  },
];
