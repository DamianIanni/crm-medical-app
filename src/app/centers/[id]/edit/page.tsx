"use client";

import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/feedback/AlertMessage";

import { useGetSingleCenter } from "@/hooks/center/useCenter";
import { CenterFormSkeleton } from "@/components/skeletons/centerFormSkeleton";

export default function EditCenterPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: center,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useGetSingleCenter(id);

  console.log("CENTER");

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching) && <CenterFormSkeleton />}

      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading center"
            description={`CODE: 3001 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      )}

      {!isPending && !isFetching && !isError && center && (
        <EntityForm formType="center" mode="edit" data={center} />
      )}
    </DashboardPageWrapper>
  );
}
