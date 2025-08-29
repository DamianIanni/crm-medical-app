import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

export default function NewMemberPage() {
  return (
    <PageAnimationWrapper>
      <DashboardPageWrapper>
        <EntityForm formType="member" mode="create" />
      </DashboardPageWrapper>
    </PageAnimationWrapper>
  );
}
