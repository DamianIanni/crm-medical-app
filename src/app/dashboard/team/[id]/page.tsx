"use client";

import EntityInfo from "@/components/feedback/entityInfo";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
// import { EntityInfoSkeleton } from "@/components/skeletons/entityInfoSkeleton";
// import { AlertMessage } from "@/components/feedback/AlertMessage";
// import { Button } from "@/components/ui/button";
import { getEntitySessionStorage } from "@/lib/utils";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function UserInfoPage() {
  const user = getEntitySessionStorage("dataEntityteam");
  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        {/* {(isPending || isFetching) && <EntityInfoSkeleton />}

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

      {!isPending && !isFetching && !isError && user && ( */}
        <EntityInfo data={user} />
        {/* )} */}
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
