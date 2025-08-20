"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/types/patient";
import { useTranslations } from "next-intl";
import Actions from "@/components/tables/actions";
import { TableCellFallback } from "@/components/tables/cellFallback";

export const useManagerPatientsColumns = (): ColumnDef<Patient>[] => {
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
      accessorKey: "phoneNumber",
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
};
