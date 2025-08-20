"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import Actions from "@/components/tables/actions";
import { TableCellFallback } from "@/components/tables/cellFallback";
import { RoleBadge } from "@/components/badges/role-badge";
import { StatusBadge } from "@/components/badges/status-badge";

export const useManagerTeamColumns = (): ColumnDef<DataUserFilter>[] => {
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
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <RoleBadge role={role} />;
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      },
    },
    // { accessorKey: "organization", header: t("organization") },
    {
      id: "actions",
      header: () => <div className="text-right min-w-[100px]"></div>,
      cell: ({ row }) => {
        const member = row.original;
        return member.role === "admin" ? null : (
          <Actions data={member} route="team" />
        );
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableSorting: false,
      enableResizing: false,
    },
  ];
};
