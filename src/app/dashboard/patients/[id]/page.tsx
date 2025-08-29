"use client";

// import { useParams } from "next/navigation";
// import { useGetSinglePatient } from "@/hooks/patient/usePatient";
// import { EntityInfoSkeleton } from "@/components/skeletons/entityInfoSkeleton";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import EntityInfo from "@/components/feedback/entityInfo";
// import { Button } from "@/components/ui/button";
// import { AlertMessage } from "@/components/feedback/AlertMessage";
// import { useDeleteState } from "@/components/providers/ContextProvider";
import { getEntitySessionStorage } from "@/lib/utils";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function PatientInfoPage() {
  // const { isDeleting } = useDeleteState();
  const patient = getEntitySessionStorage("dataEntitypatients");

  // const {
  //   data: patient,
  //   isPending,
  //   isError,
  //   isFetching,
  //   refetch,
  // } = useGetSinglePatient(id);

  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        {/* {(isPending || isFetching || isDeleting) && <EntityInfoSkeleton />}

      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading patient"
            description={`CODE: 3001 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      )}

      {!isPending && !isDeleting && !isFetching && !isError && patient && (
      )} */}
        <EntityInfo data={patient} type="patient" />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
