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
import { User } from "@/types/user";
import { Patient } from "@/types/patient";
import { Center } from "@/types/center";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "../providers/AuthProvider";
import { GeneralTooltip } from "../feedback/generalTooltip";

/**
 * @typedef {("patients" | "team" | "centers")} Route - Defines the possible routes for actions.
 */

/**
 * @typedef {("patients" | "team")} Route - Defines the possible routes for actions.
 */
export type Route = "patients" | "team" | "centers";

type ActionsProps = {
  data: Partial<User | Patient | Center>;
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
export default function Actions(props: ActionsProps): React.ReactElement {
  const { data, route, inInfo } = props;
  const deleteMember = useDeleteTeamMember();
  const deletePatient = useDeletePatient();
  const { user } = useAuth();

  /**
   * Handles the delete action based on the current route.
   * Calls the appropriate mutation (deletePatient or deleteMember) with the entity's ID.
   */

  function editCenterIdCookieSetter() {
    document.cookie = `selectedCenter=${data.id!}; path=/; max-age=86400`;
    return ROUTES.centerEdit(data.id!);
  }

  const handleDeleteAction = () => {
    if (route === "patients") {
      deletePatient.mutate(data.id!);
      // return;
    }
    if (route === "centers") {
      // TODO: Implement center deletion when hook is available
      console.log(`Delete center: ${data.id}`);
      // return;
    }
    // deleteMember.mutate(data.id!);
  };

  // Constructs the detail route dynamically based on the `route` prop.
  const detailRoute =
    route === "patients"
      ? ROUTES.patientDetail(data.id!)
      : route === "centers"
      ? ROUTES.centerDetail(data.id!)
      : ROUTES.teamMemberDetail(data.id!);

  // Constructs the edit route dynamically based on the `route` prop.
  const editRoute =
    route === "patients"
      ? ROUTES.patientEdit(data.id!)
      : route === "centers"
      ? editCenterIdCookieSetter()
      : ROUTES.teamMemberEdit(data.id!);

  console.log(editRoute);

  // Determines the title for the delete confirmation dialog.
  const TITLE =
    route === "patients"
      ? "Patient"
      : route === "centers"
      ? "Center"
      : "Team member";

  const displayName =
    route === "centers"
      ? (data as Center).name
      : `${(data as User | Patient).firstName} ${
          (data as User | Patient).lastName
        }`;

  return (
    <div className="flex justify-end gap-2 min-w-[100px]">
      {/* Conditionally renders the "View details" button. It's hidden if `inInfo` is true or route is "centers". */}
      {!inInfo && route !== "centers" && (
        <GeneralTooltip message="View details">
          <Link href={detailRoute}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="View details"
              className="hover:cursor-pointer hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="h-4 w-4 hover:bg-muted" />
            </Button>
          </Link>
        </GeneralTooltip>
      )}

      {/* Conditionally renders the "Edit" button. It's hidden for 'team' route currently. */}
      <GeneralTooltip message="Edit">
        <Link href={editRoute}>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Edit"
            className="hover:cursor-pointer hover:bg-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit2 className="h-4 w-4 hover:bg-secondary" />
          </Button>
        </Link>
      </GeneralTooltip>

      {/* Conditionally renders the "Delete" button.
          For 'team' route, it's hidden if the current user's role is 'manager'. */}
      {route === "team" && user?.role === "manager" ? null : (
        <GeneralTooltip message="Delete">
          <ActionDialog
            title={`Delete ${TITLE}`}
            description={`Are you sure you want to delete ${displayName}?\n This action cannot be undone.`}
            triggerLabel="Delete"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            triggerProps={{
              "aria-label": "Delete",
            }}
            onConfirm={() => {
              handleDeleteAction();
            }}
          />
        </GeneralTooltip>
      )}
    </div>
  );
}
