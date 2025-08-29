// /**
//  * Team Management Dashboard Page
//  *
//  * This page displays a comprehensive list of team members in a data table format.
//  * The table columns and available actions are dynamically determined based on
//  * the user's role (admin, manager, or employee) to ensure appropriate access
//  * control for team management operations.
//  */

// "use client";

// import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
// import { DataTable } from "@/components/tables/dataTable";
// import { useManagerTeamColumns } from "@/constants/tables/users/managerColumns";
// import { useAdminTeamColumns } from "@/constants/tables/users/adminColumns";
// import { useEmployeeTeamColumns } from "@/constants/tables/users/employeeColumns";
// import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
// import { useAuth } from "@/components/providers/AuthProvider";
// import { AlertMessage } from "@/components/feedback/AlertMessage";
// import { Button } from "@/components/ui/button";
// import { useGetUsers } from "@/hooks/team/useTeam";
// import { useDeleteState } from "@/components/providers/ContextProvider";
// import { filterSelfUser } from "@/lib/utils";

// export default function TeamPage() {
//   const center_id = sessionStorage.getItem("selectedCenterId");
//   const { user } = useAuth();
//   const { isDeleting } = useDeleteState();
//   const user_id = user!.id;
//   const adminTeamColumns = useAdminTeamColumns();
//   const employeeTeamColumns = useEmployeeTeamColumns();
//   const managerTeamColumns = useManagerTeamColumns();
//   const {
//     data: users,
//     isPending,
//     isError,
//     refetch,
//     isFetching,
//   } = useGetUsers(center_id!);

//   const filteredUsers = filterSelfUser(users!, user_id);

//   /**
//    * Determines which table columns to display based on user role
//    * Different roles have different permissions for team management
//    *
//    * @returns Column configuration array for the data table
//    */
//   function whichColumns() {
//     switch (user?.role) {
//       case "admin":
//         return adminTeamColumns;
//       case "manager":
//         return managerTeamColumns;
//       default:
//         return employeeTeamColumns;
//     }
//   }

//   return (
//     <DashboardPageWrapper>
//       {(isPending || isFetching || isDeleting) && <TableSkeleton />}
//       {isError && (
//         <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
//           <AlertMessage
//             title="Error loading list of users"
//             description={`CODE: 3010 - Report this to Aisel team.`}
//           />
//           <div className="mt-4 flex justify-end">
//             <Button onClick={() => refetch()}>Try Again</Button>
//           </div>
//         </div>
//       )}
//       {!isPending &&
//         !isFetching &&
//         !isDeleting &&
//         !isError &&
//         filteredUsers && (
//           <DataTable columns={whichColumns()} data={filteredUsers} />
//         )}
//     </DashboardPageWrapper>
//   );
// }

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
// import { DataUserFilter } from "@/lib/schemas/memberSchema";

export default function TeamPage() {
  const { user } = useAuth();
  const center_id = sessionStorage.getItem("selectedCenterId");
  // 1. Llama al hook que obtiene TODOS los usuarios del centro.
  //    Asumimos que 'useGetUsers' no es paginado.
  const { data: users, isPending, isError, refetch } = useGetUsers(center_id!);

  // 2. Memoizamos la selección de columnas para optimizar.
  //    No se recalculará en cada render a menos que el rol del usuario cambie.
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

  // 3. Memoizamos el filtrado del usuario para optimizar.
  //    Solo se vuelve a filtrar si la lista de 'users' o el 'user.id' cambian.
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
    // <PageAnimationWrapper>
    <DashboardPageWrapper>
      {/* 5. Se renderiza DataTable en modo "cliente". */}
      {/* Solo le pasamos las props mínimas. DataTable se encargará */}
      {/* de su propia paginación y búsqueda internas. */}
      <DataTable columns={columns} data={filteredUsers} />
    </DashboardPageWrapper>
    // </PageAnimationWrapper>
  );
}
