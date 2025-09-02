import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Patient Management System",
  description: "Sign in to access your dashboard and manage patients.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
