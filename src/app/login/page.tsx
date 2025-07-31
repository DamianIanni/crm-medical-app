/**
 * Login Page Component
 *
 * This page provides the authentication interface for users to sign in to the application.
 * It checks if a user is already authenticated and redirects them to the dashboard if so.
 * Otherwise, it displays the login form for credential entry.
 */

// "use server";

import { EntityForm } from "@/components/forms/entityForm";
import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/api/auth/getUserFromCookies";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Login - Patient Management System",
  description: "Sign in to access your dashboard and manage patients.",
};

export default async function LoginPage() {
  const user = await getUserFromCookies();

  if (user) redirect("/dashboard");

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <EntityForm formType="auth" />
      </div>
    </div>
  );
}
