import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account - Patient Management System",
  description: "Manage your account and your data.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
