"use client";

import { useGetCenterById } from "@/hooks/center/useCenter";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { EntityInfoSkeleton } from "@/components/skeletons/entityInfoSkeleton";
import CenterInfo from "@/components/feedback/centerInfo";

export default function CenterInfoPage() {
  const {
    data: center,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useGetCenterById();

  return (
    <DashboardPageWrapper className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <CenterInfo data={center} />
      )}
    </DashboardPageWrapper>
  );
}
