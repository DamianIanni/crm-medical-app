// "use server";
"use client";

import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { useParams } from "next/navigation";
import { useGetSinglePatient } from "@/hooks/patient/usePatient";
import { PatientFormSkeleton } from "@/components/skeletons/patientFormSkeleton";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { useDeleteState } from "@/components/providers/ContextProvider";

export default function EditPatientPage() {
  const params = useParams();
  const id = Number(params.id);
  const { isDeleting } = useDeleteState();
  const {
    data: patient,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useGetSinglePatient(id);

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching || isDeleting) && <PatientFormSkeleton />}

      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading patient"
            description={`CODE: 3001 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {!isPending && !isFetching && !isDeleting && !isError && patient && (
        <EntityForm formType="patient" mode={"edit"} data={patient} />
      )}
    </DashboardPageWrapper>
  );
}
