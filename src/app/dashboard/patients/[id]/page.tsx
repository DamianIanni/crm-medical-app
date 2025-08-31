"use client";

import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import EntityInfo from "@/components/feedback/entityInfo";
import { getEntitySessionStorage } from "@/lib/utils";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function PatientInfoPage() {
  const patient = getEntitySessionStorage("dataEntitypatients");

  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityInfo data={patient} type="patient" />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
