// "use client";

// import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
// import { DataTable } from "@/components/tables/dataTable";
// import { useManagerPatientsColumns } from "@/constants/tables/patients/managerColumns";
// import { useAdminPatientsColumns } from "@/constants/tables/patients/adminColumns";
// import { useEmployeePatientsColumns } from "@/constants/tables/patients/employeeColumns";
// import { useAuth } from "@/components/providers/AuthProvider";
// import { useGetPatients } from "@/hooks/patient/usePatient";
// import { AlertMessage } from "@/components/feedback/AlertMessage";
// import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
// import { Button } from "@/components/ui/button";
// import { useDeleteState } from "@/components/providers/ContextProvider";

// export default function PatientsPage() {
//   const { user } = useAuth();
//   const { isDeleting } = useDeleteState();
//   const adminPatientsColumns = useAdminPatientsColumns();
//   const employeePatientsColumns = useEmployeePatientsColumns();
//   const managerPatientsColumns = useManagerPatientsColumns();

//   // Retrieve selected center ID from sessionStorage
//   const center_id = sessionStorage.getItem("selectedCenterId");

//   const {
//     data: patients,
//     isPending,
//     isError,
//     refetch,
//     isFetching,
//   } = useGetPatients(center_id!);

//   console.log("PACIENTES", patients);

//   /**
//    * Determines which table columns to display based on user role
//    * Different roles have different permissions and see different data
//    *
//    * @returns Column configuration array for the data table
//    */
//   function whichColumns() {
//     switch (user?.role) {
//       case "admin":
//         return adminPatientsColumns;
//       case "manager":
//         return managerPatientsColumns;
//       default:
//         return employeePatientsColumns;
//     }
//   }

//   return (
//     <DashboardPageWrapper>
//       {(isPending || isFetching || isDeleting) && <TableSkeleton />}
//       {isError && (
//         <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
//           <AlertMessage
//             title="Error loading list of patients"
//             description={`CODE: 3010 - Report this to Aisel team.`}
//           />
//           <div className="mt-4 flex justify-end">
//             <Button onClick={() => refetch()}>Try Again</Button>
//           </div>
//         </div>
//       )}
//       {!isPending && !isDeleting && !isFetching && !isError && patients && (
//         <DataTable columns={whichColumns()} data={patients} />
//       )}
//     </DashboardPageWrapper>
//   );
// }

// "use client";

// import React, {
//   useState,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useMemo,
// } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   SortingState,
//   PaginationState,
//   ColumnDef,
//   getSortedRowModel,
// } from "@tanstack/react-table";
// // import { useDebounce } from "@/hooks/useDebounce";
// import { useDebounce } from "@/hooks/patient/useDebouncing";
// import { useGetPaginatedPatients } from "@/hooks/patient/usePatient";
// import { useAuth } from "@/components/providers/AuthProvider";
// import { DataTable } from "@/components/tables/dataTable";
// import { useAdminPatientsColumns } from "@/constants/tables/patients/adminColumns";
// import { useManagerPatientsColumns } from "@/constants/tables/patients/managerColumns";
// import { useEmployeePatientsColumns } from "@/constants/tables/patients/employeeColumns";
// import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
// import { AlertMessage } from "@/components/feedback/AlertMessage";
// import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
// import { Button } from "@/components/ui/button";

// const ROW_HEIGHT_PX = 52; // Ajusta esto a la altura real de tu fila, incluyendo padding

// // Hook para calcular el tamaño de página dinámico
// function useDynamicPageSize(
//   containerRef: React.RefObject<HTMLDivElement>,
//   defaultSize = 10
// ) {
//   const [pageSize, setPageSize] = useState(defaultSize);

//   useLayoutEffect(() => {
//     if (!containerRef.current) return;

//     const updateSize = () => {
//       const height = containerRef.current?.clientHeight ?? 0;
//       const rows = Math.floor(height / ROW_HEIGHT_PX);
//       setPageSize(rows > 0 ? rows : 1); // Asegura al menos 1 fila
//     };

//     const resizeObserver = new ResizeObserver(updateSize);
//     resizeObserver.observe(containerRef.current);
//     updateSize(); // Llama una vez al inicio

//     return () => resizeObserver.disconnect();
//   }, [containerRef, defaultSize]);

//   console.log("pageSize", pageSize);

//   return pageSize;
// }

// export default function PatientsPage() {
//   const { user } = useAuth();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const center_id = sessionStorage.getItem("selectedCenterId");
//   // 1. TODA LA GESTIÓN DE ESTADO VIVE AQUÍ
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const dynamicPageSize = useDynamicPageSize(containerRef);
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   // 2. EFECTOS PARA SINCRONIZAR EL ESTADO
//   useEffect(() => {
//     // Actualiza el pageSize del estado cuando el cálculo dinámico cambia
//     setPagination((prev) => ({ ...prev, pageSize: dynamicPageSize }));
//   }, [dynamicPageSize]);

//   useEffect(() => {
//     // Resetea a la página 1 cada vez que el usuario busca algo nuevo
//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));
//   }, [debouncedSearchTerm]);

//   // 3. LA LLAMADA A LA API USA EL ESTADO DEL PADRE
//   const {
//     data: response,
//     isPending,
//     isError,
//     refetch,
//   } = useGetPaginatedPatients({
//     centerId: center_id!,
//     page: pagination.pageIndex + 1,
//     limit: pagination.pageSize,
//     search: debouncedSearchTerm,
//   });

//   console.log("RESPONSE", response);

//   const patientsData = response?.data ?? [];
//   const pageCount = response?.pagination?.totalPages ?? 0;

//   // 4. SELECCIÓN DE COLUMNAS MEMOIZADA
//   const adminPatientsColumns = useAdminPatientsColumns();
//   const employeePatientsColumns = useEmployeePatientsColumns();
//   const managerPatientsColumns = useManagerPatientsColumns();

//   const columns = useMemo(() => {
//     if (!user) return []; // Devuelve un array vacío si el usuario no ha cargado
//     switch (user.role) {
//       case "admin":
//         return adminPatientsColumns;
//       case "manager":
//         return managerPatientsColumns;
//       default:
//         return employeePatientsColumns;
//     }
//   }, [
//     user,
//     adminPatientsColumns,
//     managerPatientsColumns,
//     employeePatientsColumns,
//   ]);

//   // 5. LA INSTANCIA DE LA TABLA SE CREA EN EL PADRE
//   const table = useReactTable({
//     data: patientsData,
//     columns,
//     pageCount,
//     state: { sorting, pagination, pagData: response?.pagination },
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     manualPagination: true,
//     manualFiltering: true,
//   });

//   // console.log("TABLE", table);

//   // 6. RENDERIZADO CONDICIONAL
//   if ((isPending && patientsData.length === 0) || !user) {
//     return (
//       <DashboardPageWrapper>
//         <TableSkeleton />
//       </DashboardPageWrapper>
//     );
//   }

//   if (isError) {
//     return (
//       <DashboardPageWrapper>
//         <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
//           <AlertMessage
//             title="Error loading list of patients"
//             description={`An error occurred while fetching the patient list.`}
//           />
//           <div className="mt-4">
//             <Button onClick={() => refetch()}>Try Again</Button>
//           </div>
//         </div>
//       </DashboardPageWrapper>
//     );
//   }

//   return (
//     <DashboardPageWrapper>
//       {/* 7. PASA LA INSTANCIA DE LA TABLA Y LA REF AL HIJO */}
//       <DataTable
//         ref={containerRef}
//         table={table}
//         columns={columns} // Pasa las columnas para el colSpan del mensaje "No results"
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//       />
//     </DashboardPageWrapper>
//   );
// }

"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { useDebounce } from "@/hooks/patient/useDebouncing";
import { useGetPaginatedPatients } from "@/hooks/patient/usePatient";
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

  // Aseguramos que sessionStorage solo se llame en el cliente
  const [centerId, setCenterId] = useState<string | null>(null);
  useEffect(() => {
    setCenterId(sessionStorage.getItem("selectedCenterId"));
  }, []);

  // 1. Gestión de estado en el componente padre
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const { pageSize: dynamicPageSize, containerRef } = useDynamicPageSize(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 2. Sincronización de estado con efectos
  // useEffect(() => {
  //   if (dynamicPageSize > 0) {
  //     setPagination((prev) => ({ ...prev, pageSize: dynamicPageSize }));
  //   }
  // }, [dynamicPageSize]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 0, // Resetea a la página 1 al cambiar el tamaño
    }));
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchTerm]);

  // 3. Llamada a la API con el estado actual
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

  const patientsData = response?.data ?? [];
  const pageCount = response?.pagination?.totalPages ?? 0;

  // 4. Selección de columnas memoizada y segura
  const adminCols = useAdminPatientsColumns();
  const managerCols = useManagerPatientsColumns();
  const employeeCols = useEmployeePatientsColumns();

  const columns = useMemo(() => {
    switch (user?.role) {
      case "admin":
        return adminCols;
      case "manager":
        return managerCols;
      case "employee":
        return employeeCols;
      default:
        return []; // Devuelve un array vacío si el rol no está definido
    }
  }, [user?.role, adminCols, managerCols, employeeCols]);

  // 5. Creación de la instancia de la tabla
  const table = useReactTable({
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

  // 6. Renderizado condicional robusto
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
    // <PageAnimationWrapper>
    <DashboardPageWrapper>
      {/* 7. Pasa la instancia de la tabla y las props necesarias al DataTable */}
      <DataTable
        table={table}
        columns={columns}
        totalItems={response?.pagination?.totalItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onPageSizeChange={handlePageSizeChange}
      />
    </DashboardPageWrapper>
    // </PageAnimationWrapper>
  );
}
