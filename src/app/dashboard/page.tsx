/**
 * Dashboard Root Page Component
 *
 * This page serves as the entry point to the dashboard section of the application.
 * It automatically redirects users to the patients page, which is the default
 * dashboard view for managing patient information.
 */

import { redirect } from "next/navigation";

// Page metadata for the dashboard
export const metadata = {
  title: "Dashboard - Patient Management System",
  description: "Overview of your patient management dashboard and team.",
};

/**
 * Dashboard Redirect Component
 * Automatically redirects users to the patients dashboard page
 *
 * @returns Never returns JSX - always redirects to /dashboard/patients
 */
export default async function DashboardRedirect() {
  // Redirect to the patients page as the default dashboard view
  redirect("/dashboard/patients");
}
