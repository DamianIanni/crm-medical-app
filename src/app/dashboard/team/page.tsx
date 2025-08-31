"use client";

import React, { useMemo } from "react";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { DataTable } from "@/components/tables/dataTable";
import { useManagerTeamColumns } from "@/constants/tables/users/managerColumns";
import { useAdminTeamColumns } from "@/constants/tables/users/adminColumns";
import { useEmployeeTeamColumns } from "@/constants/tables/users/employeeColumns";
import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/team/useTeam";
import { filterSelfUser } from "@/lib/utils";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function TeamPage() {
  const { user } = useAuth();
  const center_id = sessionStorage.getItem("selectedCenterId");
  // 1. Call the hook that gets ALL users from the center.
  //    We assume 'useGetUsers' is not paginated.
  const { data: users, isPending, isError, refetch } = useGetUsers(center_id!);

  // 2. Memoize column selection for optimization.
  //    It won't recalculate on every render unless the user's role changes.
  const adminTeamColumns = useAdminTeamColumns();
  const employeeTeamColumns = useEmployeeTeamColumns();
  const managerTeamColumns = useManagerTeamColumns();

  const columns = useMemo(() => {
    if (!user) return [];
    switch (user.role) {
      case "admin":
        return adminTeamColumns;
      case "manager":
        return managerTeamColumns;
      default:
        return employeeTeamColumns;
    }
  }, [user, adminTeamColumns, managerTeamColumns, employeeTeamColumns]);

  // 3. Memoize user filtering for optimization.
  //    It only refilters if the 'users' list or 'user.id' changes.
  const filteredUsers = useMemo(() => {
    if (!users || !user) return [];
    return filterSelfUser(users, user.id);
  }, [users, user]);

  // 4. Renderizado condicional robusto.
  if (isPending || !user) {
    return (
      <PageAnimationWrapper>
        <DashboardPageWrapper>
          <TableSkeleton />
        </DashboardPageWrapper>
      </PageAnimationWrapper>
    );
  }

  if (isError) {
    return (
      <PageAnimationWrapper>
        <DashboardPageWrapper>
          <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
            <AlertMessage
              title="Error loading list of users"
              description="An error occurred while fetching the team list."
            />
            <div className="mt-4">
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </DashboardPageWrapper>
      </PageAnimationWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
      {/* 5. Render DataTable in "client" mode. */}
      {/* We only pass the minimum required props. DataTable will handle */}
      {/* its own internal pagination and searching. */}
      <DataTable columns={columns} data={filteredUsers} />
    </DashboardPageWrapper>
  );
}
