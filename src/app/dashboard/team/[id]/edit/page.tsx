"use client";

import { EntityForm } from "@/components/forms/entityForm";
import { getEntitySessionStorage } from "@/lib/utils";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";

export default function EditMemberPage() {
  const user = getEntitySessionStorage("dataEntityteam");

  return (
    <DashboardPageWrapper>
      <EntityForm formType="member" mode="edit" data={user} />
    </DashboardPageWrapper>
  );
}
