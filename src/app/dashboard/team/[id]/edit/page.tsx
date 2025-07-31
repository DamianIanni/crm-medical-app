"use server";

import { EntityForm } from "@/components/forms/entityForm";
import DashboardPageWrapper from "@/components/wrappers/dashboardPageWrapper";
import { notFound } from "next/navigation";
import { getUserById } from "@/app/api/simulatedAPI/userMethods";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMemberPage(props: Props) {
  const { params } = props;
  const id = Number((await params).id);
  const member = await getUserById(id);

  if (!member) return notFound();

  return (
    <DashboardPageWrapper>
      <EntityForm formType="member" mode={"edit"} data={member} />
    </DashboardPageWrapper>
  );
}
