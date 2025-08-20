"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const useEmployeeTeamColumns = (): ColumnDef<DataUserFilter>[] => {
  const t = useTranslations("Table.Users");

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
      accessorKey: "role",
      header: t("role"),
    },
    {
      accessorKey: "organization",
      header: t("organization"),
    },
  ];
};
