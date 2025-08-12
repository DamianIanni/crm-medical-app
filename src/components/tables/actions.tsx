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
import { User } from "@/types/user";
import { Patient } from "@/types/patient";
import { Center } from "@/types/center";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "../providers/AuthProvider";
import { GeneralTooltip } from "../feedback/generalTooltip";
import { useRouter } from "next/navigation";
import React from "react";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { setEntitySessionStorage } from "@/lib/utils";
/**
 * @typedef {("patients" | "team" | "centers")} Route - Defines the possible routes for actions.
 */

/**
 * @typedef {("patients" | "team")} Route - Defines the possible routes for actions.
 */
export type Route = "patients" | "team" | "centers";

type ActionsProps = {
  data: Partial<DataUserFilter | Patient | Center>;
  route: Route;
  inInfo?: boolean;
};

/**
 * Actions component.
 * Renders a set of action buttons (View details, Edit, Delete) for either patient or team member entities.
 * The visibility and behavior of these buttons are determined by the `route`, user's `role`, and `inInfo` prop.
 *
 * @param {ActionsProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered action buttons.
 */
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

  const helpers: Record<Route, RouteHelper> = {
    patients: {
      title: "Patient",
      detailUrl: ROUTES.patientDetail(entityId),
      editUrl: ROUTES.patientEdit(entityId),
      displayName: data.firstName || "Patient",
      onDelete: () => deletePatient.mutate(entityId),
    },
    centers: {
      title: "Center",
      detailUrl: ROUTES.centerDetail(entityId),
      editUrl: (() => {
        sessionStorage.setItem("selectedCenterId", entityId);
        return ROUTES.centerEdit(entityId);
      })(),
      displayName: (data as Center).name ?? "Center",
      onDelete: () => {
        deleteCenter.mutate(String(entityId));
        sessionStorage.removeItem("selectedCenterName");
        sessionStorage.removeItem("selectedCenterId");
        router.replace("/centers");
      },
      hideDetails: true, // Centers table has no detail view
    },
    team: {
      title: "Team member",
      detailUrl: ROUTES.teamMemberDetail(entityId),
      editUrl: ROUTES.teamMemberEdit(entityId),
      displayName: `${data.first_name} ${data.last_name}`,
      onDelete: () => {
        deleteMember.mutate(entityId);
        router.replace("/dashboard/team");
      },
    },
  };

  const { title, detailUrl, editUrl, displayName, onDelete, hideDetails } =
    helpers[route];

  /* --------------------------------------------------
   * Render
   * --------------------------------------------------*/
  const canDelete = !(route === "team" && user?.role === "manager");

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    setEntitySessionStorage(`dataEntity${route}`, JSON.stringify(data));
  };

  return (
    <div className="flex justify-end gap-2 min-w-[100px]">
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
            title={`Delete ${title}`}
            description={`Are you sure you want to delete ${displayName}? This action cannot be undone.`}
            triggerLabel="Delete"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            triggerProps={{
              "aria-label": "Delete",
              onClick: (e) => e.stopPropagation(),
            }}
            onConfirm={onDelete}
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
