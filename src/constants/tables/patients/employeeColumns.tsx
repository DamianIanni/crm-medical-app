"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/patient";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const employeePatientsColumns: ColumnDef<Patient>[] = [
  {
    header: "Full name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
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
    accessorKey: "treatment",
    header: "Treatment",
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return (
        <TableCellFallback value={treatment} fallback="No treatment info" />
      );
    },
  },
];
