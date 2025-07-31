"use client";

import EntityInfo from "@/components/feedback/entityInfo";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { useParams } from "next/navigation";
import { useGetSingleUser } from "@/hooks/team/useTeam";
import { EntityInfoSkeleton } from "@/components/skeletons/entityInfoSkeleton";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { Button } from "@/components/ui/button";

export default function UserInfoPage() {
  const params = useParams();
  const id = Number(params.id);
  const {
    data: user,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useGetSingleUser(id);

  return (
    <DashboardPageWrapper>
      {(isPending || isFetching) && <EntityInfoSkeleton />}

      {isError && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center mx-auto mt-10">
          <AlertMessage
            title="Error loading member"
            description={`CODE: 4001 - Report this to Aisel team.`}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      )}

      {!isPending && !isFetching && !isError && user && (
        <EntityInfo data={user} />
      )}
    </DashboardPageWrapper>
  );
}
