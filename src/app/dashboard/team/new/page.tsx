import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";

export default function NewMemberPage() {
  return (
    <DashboardPageWrapper>
      <EntityForm formType="member" mode="create" />
    </DashboardPageWrapper>
  );
}
