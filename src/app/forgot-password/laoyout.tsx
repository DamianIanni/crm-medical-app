import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Patient Management System",
  description: "Forgot your password? No problem! Reset it here.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
