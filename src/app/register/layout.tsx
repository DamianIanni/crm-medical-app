import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Patient Management System",
  description: "Sign up to access your dashboard and manage patients.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
