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
import { ROUTES } from "@/constants/routes";
import { useAuth } from "../providers/AuthProvider";
import { GeneralTooltip } from "../feedback/generalTooltip";
import { useRouter } from "next/navigation";
import { useDeleteState } from "../providers/ContextProvider";

/**
 * @typedef {("patients" | "team")} Route - Defines the possible routes for actions.
 */
export type Route = "patients" | "team";

type ActionsProps = {
  data: Partial<User | Patient>;
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
  const router = useRouter();
  const { setIsDeleting } = useDeleteState();

  /**
   * Handles the delete action based on the current route.
   * Calls the appropriate mutation (deletePatient or deleteMember) with the entity's ID.
   */

  function navigation(route?: string) {
    if (route) {
      router.replace("/dashboard/patients");
    } else {
      router.replace("/dashboard/team");
    }
  }

  function handleDeleteAction() {
    setIsDeleting(true);
    if (route === "patients") {
      deletePatient.mutate(data.id!);
      navigation(route);
      return;
    }
    deleteMember.mutate(data.id!);
    navigation();
  }

  // Constructs the detail route dynamically based on the `route` prop.
  const detailRoute =
    route === "patients"
      ? ROUTES.patientDetail(data.id!)
      : ROUTES.teamMemberDetail(data.id!);

  // Constructs the edit route dynamically based on the `route` prop.
  const editRoute =
    route === "patients"
      ? ROUTES.patientEdit(data.id!)
      : ROUTES.teamMemberEdit(data.id!);

  // Determines the title for the delete confirmation dialog.
  const TITLE = route === "patients" ? "Patient" : "Team member";

  return (
    <div className="flex justify-end gap-2 min-w-[100px]">
      {/* Conditionally renders the "View details" button. It's hidden if `inInfo` is true. */}
      {!inInfo && (
        <GeneralTooltip message="View details">
          <Link href={detailRoute}>
            <span>
              <Button
                variant="ghost"
                size="sm"
                aria-label="View details"
                className="hover:cursor-pointer  hover:bg-muted"
              >
                <Info className="h-4 w-4  hover:bg-muted" />
              </Button>
            </span>
          </Link>
        </GeneralTooltip>
      )}

      {/* Conditionally renders the "Edit" button. It's hidden for 'team' route currently. */}
      {route !== "team" && (
        <GeneralTooltip message="Edit">
          <Link href={editRoute}>
            <span>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Edit"
                className="hover:cursor-pointer hover:bg-secondary"
              >
                <Edit2 className="h-4 w-4 hover:bg-secondary" />
              </Button>
            </span>
          </Link>
        </GeneralTooltip>
      )}
      {/* Conditionally renders the "Delete" button.
          For 'team' route, it's hidden if the current user's role is 'manager'. */}
      {route === "team" && user?.role === "manager" ? null : (
        <GeneralTooltip message="Delete">
          <ActionDialog
            title={`Delete ${TITLE}`}
            description={`Are you sure you want to delete ${data.firstName} ${data.lastName}?\n This action cannot be undone.`}
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
