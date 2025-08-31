"use client";

import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

import { getEntitySessionStorage } from "@/lib/utils";

export default function EditPatientPage() {
  const patient = getEntitySessionStorage("dataEntitypatients");

  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityForm formType="patient" mode={"edit"} data={patient} />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
