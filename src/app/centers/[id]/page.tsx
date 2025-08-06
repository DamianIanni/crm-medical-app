"use client";

import { useParams } from "next/navigation";
import { useGetSingleCenter } from "@/hooks/center/useCenter";
import EntityInfo from "@/components/feedback/entityInfo";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { EntityInfoSkeleton } from "@/components/skeletons/entityInfoSkeleton";

export default function CenterInfoPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: center,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useGetSingleCenter(id);

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching) && <EntityInfoSkeleton />}

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
        <EntityInfo data={center} />
      )}
    </DashboardPageWrapper>
  );
}