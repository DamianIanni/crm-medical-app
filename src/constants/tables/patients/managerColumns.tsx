"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/patient";
import Actions from "@/components/tables/actions";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const managerPatientsColumns: ColumnDef<Patient>[] = [
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
    accessorKey: "short_description",
    header: "Diagnosis",
    cell: ({ getValue }) => {
      const treatment = getValue() as string | undefined | null;

      return (
        <TableCellFallback value={treatment} fallback="No treatment info" />
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right min-w-[100px]"></div>,
    cell: ({ row }) => {
      const patient = row.original;

      return <Actions data={patient} route="patients" />;
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    enableSorting: false,
    enableResizing: false,
  },
];
