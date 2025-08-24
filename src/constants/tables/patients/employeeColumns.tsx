"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/patient";
import { useTranslations } from "next-intl";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const useEmployeePatientsColumns = (): ColumnDef<Patient>[] => {
  const t = useTranslations("Table.Patients");

  return [
    {
      header: t("fullName"),
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      cell: ({ getValue }) => {
        const treatment = getValue() as string | undefined | null;
        return <TableCellFallback value={treatment} fallback={t("noInfo")} />;
      },
      id: "fullName",
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "phone",
      header: t("phone"),
    },
    {
      accessorKey: "short_description",
      header: t("diagnosis"),
      cell: ({ getValue }) => {
        const treatment = getValue() as string | undefined | null;
        return (
          <TableCellFallback value={treatment} fallback={t("noDescription")} />
        );
      },
    },
  ];
};
