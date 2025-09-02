import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centers - Patient Management System",
  description: "Manage your centers",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
