"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import { useDebounce } from "@/hooks/patient/useDebouncing";
import { useGetPaginatedPatients } from "@/hooks/patient/usePatient";
import { Patient } from "@/types/patient";
import { useAuth } from "@/components/providers/AuthProvider";
import { DataTable } from "@/components/tables/dataTable";
import { useAdminPatientsColumns } from "@/constants/tables/patients/adminColumns";
import { useManagerPatientsColumns } from "@/constants/tables/patients/managerColumns";
import { useEmployeePatientsColumns } from "@/constants/tables/patients/employeeColumns";
import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { Button } from "@/components/ui/button";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function PatientsPage() {
  const { user } = useAuth();

  // Ensure sessionStorage is only called on the client
  const [centerId, setCenterId] = useState<string | null>(null);
  useEffect(() => {
    setCenterId(sessionStorage.getItem("selectedCenterId"));
  }, []);

  // 1. State management in the parent component
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handlePageSizeChange = useCallback((size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 0, // Reset to page 1 when changing size
    }));
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchTerm]);

  // 3. API call with current state
  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useGetPaginatedPatients({
    centerId: centerId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchTerm,
    enabled: !!centerId && pagination.pageSize > 0,
  });

  const patientsData: Patient[] = response?.data ?? [];
  const pageCount = response?.pagination?.totalPages ?? 0;

  // 4. Memoized and safe column selection
  const adminCols = useAdminPatientsColumns();
  const managerCols = useManagerPatientsColumns();
  const employeeCols = useEmployeePatientsColumns();

  const columns = useMemo<ColumnDef<Patient>[]>(() => {
    switch (user?.role) {
      case "admin":
        return adminCols;
      case "manager":
        return managerCols;
      case "employee":
        return employeeCols;
      default:
        return []; // Returns an empty array if role is not defined
    }
  }, [user?.role, adminCols, managerCols, employeeCols]);

  // 5. Table instance creation
  const table = useReactTable<Patient>({
    data: patientsData,
    columns,
    pageCount,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  // 6. Robust conditional rendering
  if ((isPending && patientsData.length === 0) || !user) {
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
              title="Error loading list of patients"
              description="An error occurred while fetching the patient list."
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
      {/* 7. Pass the table instance and necessary props to DataTable */}
      <DataTable
        table={table}
        columns={columns}
        totalItems={response?.pagination?.totalItems ?? 0}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onPageSizeChange={handlePageSizeChange}
      />
    </DashboardPageWrapper>
  );
}
