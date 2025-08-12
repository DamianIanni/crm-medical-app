/**
 * Team Management Dashboard Page
 *
 * This page displays a comprehensive list of team members in a data table format.
 * The table columns and available actions are dynamically determined based on
 * the user's role (admin, manager, or employee) to ensure appropriate access
 * control for team management operations.
 */

"use client";

import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { DataTable } from "@/components/tables/dataTable";
import { managerTeamColumns } from "@/constants/tables/users/managerColumns";
import { adminTeamColumns } from "@/constants/tables/users/adminColumns";
import { employeeTeamColumns } from "@/constants/tables/users/employeeColumns";
import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/team/useTeam";
import { useDeleteState } from "@/components/providers/ContextProvider";
import { filterSelfUser } from "@/lib/utils";

export default function TeamPage() {
  const center_id = sessionStorage.getItem("selectedCenterId");
  const { user } = useAuth();
  const { isDeleting } = useDeleteState();
  const user_id = user!.id;
  const {
    data: users,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetUsers(center_id!);

  const filteredUsers = filterSelfUser(users!, user_id);

  /**
   * Determines which table columns to display based on user role
   * Different roles have different permissions for team management
   *
   * @returns Column configuration array for the data table
   */
  function whichColumns() {
    switch (user?.role) {
      case "admin":
        return adminTeamColumns;
      case "manager":
        return managerTeamColumns;
      default:
        return employeeTeamColumns;
    }
  }

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching || isDeleting) && <TableSkeleton />}
      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading list of users"
            description={`CODE: 3010 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      )}
      {!isPending &&
        !isFetching &&
        !isDeleting &&
        !isError &&
        filteredUsers && (
          <DataTable columns={whichColumns()} data={filteredUsers} />
        )}
    </DashboardPageWrapper>
  );
}
