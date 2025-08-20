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
import { Center } from "@/types/center";
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

type ActionsProps = {
  data: DataUserFilter | Patient | Center;
  route: Route;
  inInfo?: boolean;
};

export default function Actions({
  data,
  route,
  inInfo,
}: ActionsProps): React.ReactElement {
  // Support both camelCase and snake_case ids coming from different endpoints
  const entityId: string = (data as any).user_id ?? (data as any).id;

  const deleteMember = useDeleteTeamMember();
  const deletePatient = useDeletePatient(entityId);
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
      onDelete: () => deletePatient.mutate(entityId),
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
        deleteCenter.mutate(entityId);
        sessionStorage.removeItem("selectedCenterName");
        sessionStorage.removeItem("selectedCenterId");
        router.replace("/centers");
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
          />
        </GeneralTooltip>
      )}
    </div>
  );
}

//   // Obtain selected center ID from cookie (set elsewhere in the app)
//   const deleteMember = useDeleteTeamMember(data.user_id!);
//   const deletePatient = useDeletePatient(data.user_id!);
//   const deleteCenter = useDeleteCenter();
//   const { user } = useAuth();
//   const router = useRouter();

//   /**
//    * Handles the delete action based on the current route.
//    * Calls the appropriate mutation (deletePatient or deleteMember) with the entity's ID.
//    */

//   function editCenterIdCookieSetter() {
//     sessionStorage.setItem("selectedCenterId", data.user_id!);
//     return ROUTES.centerEdit(data.user_id!);
//   }

//   const handleDeleteAction = () => {
//     if (route === "patients") {
//       deletePatient.mutate(data.user_id!);
//       // return;
//     }
//     if (route === "centers") {
//       deleteCenter.mutate(String(data.user_id!));
//       sessionStorage.removeItem("selectedCenterName");
//       sessionStorage.removeItem("selectedCenterId");
//       router.replace("/centers");
//     }
//     // deleteMember.mutate(data.id!);
//   };

//   // Constructs the detail route dynamically based on the `route` prop.
//   const detailRoute =
//     route === "patients"
//       ? ROUTES.patientDetail(data.user_id!)
//       : route === "centers"
//       ? ROUTES.centerDetail(data.user_id!)
//       : ROUTES.teamMemberDetail(data.user_id!);
//   console.log(data.user_id!);

//   // Constructs the edit route dynamically based on the `route` prop.
//   const editRoute =
//     route === "patients"
//       ? ROUTES.patientEdit(data.user_id!)
//       : route === "centers"
//       ? editCenterIdCookieSetter()
//       : ROUTES.teamMemberEdit(data.user_id!);

//   // Determines the title for the delete confirmation dialog.
//   const TITLE =
//     route === "patients"
//       ? "Patient"
//       : route === "centers"
//       ? "Center"
//       : "Team member";

//   const displayName =
//     route === "centers"
//       ? (data as Center).name
//       : `${(data as User | Patient).firstName} ${
//           (data as User | Patient).lastName
//         }`;

//   return (
//     <div className="flex justify-end gap-2 min-w-[100px]">
//       {/* Conditionally renders the "View details" button. It's hidden if `inInfo` is true or route is "centers". */}
//       {!inInfo && route !== "centers" && (
//         <GeneralTooltip message="View details">
//           <Link href={detailRoute}>
//             <Button
//               variant="ghost"
//               size="sm"
//               aria-label="View details"
//               className="hover:cursor-pointer hover:bg-muted"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Info className="h-4 w-4 hover:bg-muted" />
//             </Button>
//           </Link>
//         </GeneralTooltip>
//       )}

//       {/* Conditionally renders the "Edit" button. It's hidden for 'team' route currently. */}
//       <GeneralTooltip message="Edit">
//         <Link href={editRoute}>
//           <Button
//             variant="ghost"
//             size="sm"
//             aria-label="Edit"
//             className="hover:cursor-pointer hover:bg-secondary"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Edit2 className="h-4 w-4 hover:bg-secondary" />
//           </Button>
//         </Link>
//       </GeneralTooltip>

//       {/* Conditionally renders the "Delete" button.
//           For 'team' route, it's hidden if the current user's role is 'manager'. */}
//       {route === "team" && user?.role === "manager" ? null : (
//         <GeneralTooltip message="Delete">
//           <ActionDialog
//             title={`Delete ${TITLE}`}
//             description={`Are you sure you want to delete ${displayName}?\n This action cannot be undone.`}
//             triggerLabel="Delete"
//             confirmLabel="Delete"
//             cancelLabel="Cancel"
//             triggerProps={{
//               "aria-label": "Delete",
//               onClick: (e) => e.stopPropagation(),
//             }}
//             onConfirm={() => {
//               handleDeleteAction();
//             }}
//           />
//         </GeneralTooltip>
//       )}
//     </div>
//   );
// }
