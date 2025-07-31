/**
 * Patients Dashboard Page
 *
 * This page displays a comprehensive list of patients in a data table format.
 * The table columns and available actions are dynamically determined based on
 * the user's role (admin, manager, or employee) to ensure appropriate access
 * control and functionality.
 */
"use client";

import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { DataTable } from "@/components/tables/dataTable";
import { managerPatientsColumns } from "@/constants/tables/patients/managerColumns";
import { adminPatientsColumns } from "@/constants/tables/patients/adminColumns";
import { employeePatientsColumns } from "@/constants/tables/patients/employeeColumns";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGetPatients } from "@/hooks/patient/usePatient";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
import { Button } from "@/components/ui/button";
import { useDeleteState } from "@/components/providers/ContextProvider";

export default function PatientsPage() {
  const { user } = useAuth();
  const { isDeleting } = useDeleteState();
  const {
    data: patients,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetPatients();

  /**
   * Determines which table columns to display based on user role
   * Different roles have different permissions and see different data
   *
   * @returns Column configuration array for the data table
   */
  function whichColumns() {
    switch (user?.role) {
      case "admin":
        return adminPatientsColumns;
      case "manager":
        return managerPatientsColumns;
      default:
        return employeePatientsColumns;
    }
  }

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching || isDeleting) && <TableSkeleton />}
      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading list of patients"
            description={`CODE: 3010 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      )}
      {!isPending && !isDeleting && !isFetching && !isError && patients && (
        <DataTable columns={whichColumns()} data={patients} />
      )}
    </DashboardPageWrapper>
  );
}
