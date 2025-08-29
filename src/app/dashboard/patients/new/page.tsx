import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function NewPatientPage() {
  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityForm formType="patient" />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
