"use client";

import EntityInfo from "@/components/feedback/entityInfo";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { getEntitySessionStorage } from "@/lib/utils";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function UserInfoPage() {
  const user = getEntitySessionStorage("dataEntityteam");
  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityInfo data={user} type="user" />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
