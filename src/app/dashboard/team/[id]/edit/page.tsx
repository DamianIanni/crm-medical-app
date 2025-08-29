"use client";

import { EntityForm } from "@/components/forms/entityForm";
import { getEntitySessionStorage } from "@/lib/utils";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function EditMemberPage() {
  const user = getEntitySessionStorage("dataEntityteam");

  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityForm formType="member" mode="edit" data={user} />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
