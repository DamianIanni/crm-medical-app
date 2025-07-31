import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team - Patient Management System",
  description:
    "Manage your team members and their roles with role-based access controls.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
