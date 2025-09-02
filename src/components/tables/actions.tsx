/**
 * @file Actions.tsx
 * @summary This component provides action buttons (view, edit, delete) for patient and team member entities.
 * It conditionally renders these actions based on the `route` and user's role, and includes
 * confirmation dialogs for delete operations.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Info, Edit2 } from "lucide-react";
import Link from "next/link";
import { useDeleteTeamMember } from "@/hooks/team/useTeam";
import { useDeletePatient } from "@/hooks/patient/usePatient";
import { ActionDialog } from "@/components/feedback/actionDialog";
import { useDeleteCenter } from "@/hooks/center/useCenter";
import { Patient } from "@/types/patient";
import { Center } from "@/types/center/index";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "../providers/AuthProvider";
import { GeneralTooltip } from "../feedback/generalTooltip";
import { useRouter } from "next/navigation";
import React from "react";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { setEntitySessionStorage } from "@/lib/utils";
import { useTranslations } from "next-intl";
/**
 * @typedef {("patients" | "team" | "centers")} Route - Defines the possible routes for actions.
 */

/**
 * @typedef {("patients" | "team")} Route - Defines the possible routes for actions.
 */
export type Route = "patients" | "team" | "centers";

// Define a more specific type for the data prop based on the route
type RouteData = {
  patients: Patient;
  team: DataUserFilter;
  centers: Center;
};

export default function Actions<T extends Route>({
  data,
  route,
  inInfo,
}: {
  data: RouteData[T];
  route: T;
  inInfo?: boolean;
}): React.ReactElement {
  // Extract the appropriate ID based on route type
  const entityId: string =
    route === "team"
      ? (data as DataUserFilter).user_id
      : route === "centers"
      ? "center_id" in data
        ? data.center_id
        : "id" in data
        ? data.id
        : ""
      : route === "patients"
      ? (data as Patient).id
      : "";

  const deleteMember = useDeleteTeamMember();
  const deletePatient = useDeletePatient();
  const deleteCenter = useDeleteCenter();

  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations("ActionDialog.default");

  /* --------------------------------------------------
   * Route helpers (Single-responsibility)
   * --------------------------------------------------*/
  type RouteHelper = {
    title: string;
    detailUrl: string;
    editUrl: string;
    displayName: string;
    onDelete: () => void;
    hideDetails?: boolean;
  };

  const getDisplayName = (): string => {
    if ("first_name" in data && "last_name" in data) {
      return `${data.first_name} ${data.last_name}`.trim() || "Item";
    }
    if ("name" in data && data.name) {
      return data.name;
    }
    return "Item";
  };

  // Get translations for entity types
  const entityT = useTranslations("EntityTypes");

  const helpers: Record<Route, RouteHelper> = {
    patients: {
      title: entityT("patient"),
      detailUrl: ROUTES.patientDetail(entityId),
      editUrl: ROUTES.patientEdit(entityId),
      displayName: getDisplayName(),
      onDelete: () => {
        deletePatient.mutate(entityId);
        router.replace("/dashboard/patients");
      },
    },
    centers: {
      title: entityT("center"),
      detailUrl: ROUTES.centerDetail(entityId),
      editUrl: (() => {
        sessionStorage.setItem("selectedCenterId", entityId);
        return ROUTES.centerEdit(entityId);
      })(),
      displayName: getDisplayName(),
      onDelete: () => {
        if (entityId) {
          deleteCenter.mutate(entityId);
          sessionStorage.removeItem("selectedCenterName");
          sessionStorage.removeItem("selectedCenterId");
          router.replace("/centers");
        }
      },
      hideDetails: true, // Centers table has no detail view
    },
    team: {
      title: entityT("teamMember"),
      detailUrl: ROUTES.teamMemberDetail(entityId),
      editUrl: ROUTES.teamMemberEdit(entityId),
      displayName: getDisplayName(),
      onDelete: () => {
        deleteMember.mutate(entityId);
        router.replace("/dashboard/team");
      },
    },
  };

  const { title, detailUrl, editUrl, displayName, onDelete } = helpers[route];

  /* --------------------------------------------------
   * Render
   * --------------------------------------------------*/
  const canDelete = !(
    route === "team" &&
    (user?.role === "manager" || user?.role === "employee")
  );

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    setEntitySessionStorage(`dataEntity${route}`, JSON.stringify(data));
  };

  return (
    <div className="flex justify-end gap-1 min-w-[100px]">
      {/* Details */}
      {!inInfo && detailUrl && (
        <GeneralTooltip message="View details">
          <Link href={detailUrl} onClick={(e) => handleLinkClick(e)}>
            <Button variant="ghost" size="sm" aria-label="View details">
              <Info className="h-4 w-4" />
            </Button>
          </Link>
        </GeneralTooltip>
      )}

      {/* Edit */}
      <GeneralTooltip message="Edit">
        <Link href={editUrl} onClick={(e) => handleLinkClick(e)}>
          <Button variant="ghost" size="sm" aria-label="Edit">
            <Edit2 className="h-4 w-4" />
          </Button>
        </Link>
      </GeneralTooltip>

      {/* Delete */}
      {canDelete && (
        <GeneralTooltip message="Delete">
          <ActionDialog
            title={t("deleteTitle", { title: title })}
            description={t("deleteDescription", {
              name: displayName,
            })}
            confirmLabel={t("delete")}
            cancelLabel={t("cancel")}
            onConfirm={onDelete}
            variant="delete"
            triggerProps={{
              variant: "outline",
              size: "sm",
              className: "text-destructive hover:text-destructive",
            }}
          />
        </GeneralTooltip>
      )}
    </div>
  );
}
