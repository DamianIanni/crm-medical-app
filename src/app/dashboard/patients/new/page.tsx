import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";

export default function NewPatientPage() {
  return (
    <DashboardPageWrapper>
      <EntityForm formType="patient" />
    </DashboardPageWrapper>
  );
}
