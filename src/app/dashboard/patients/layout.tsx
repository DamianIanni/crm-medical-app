// app/patients/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patients - Patient Management System",
  description:
    "View and manage your list of patients with role-based access controls.",
};

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
