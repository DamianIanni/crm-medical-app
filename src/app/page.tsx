/**
 * Home Page Component
 *
 * This is the root page of the application that handles authentication checks
 * and redirects users to the appropriate destination based on their login status.
 * Authenticated users are redirected to the dashboard, while unauthenticated users
 * are sent to the login page.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/api/jwtUtil";

// Force dynamic rendering to ensure fresh authentication checks on each request
export const dynamic = "force-dynamic";

// Metadata for the home page
export const metadata = {
  title: "Patient Management System - Home",
  description:
    "Welcome to the Patient Management System. Please log in to access your dashboard.",
};

/**
 * Home Page Component
 * Performs authentication verification and redirects users accordingly
 *
 * @returns Never returns JSX - always redirects to either login or dashboard
 */
export default async function Home() {
  // Get authentication token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Redirect to login if no token is present
  if (!token) {
    redirect("/login");
  }

  // Verify the JWT token and get user information
  const user = await verifyJWT(token);

  // Redirect to login if token is invalid or user doesn't exist
  if (!user) {
    redirect("/login");
  }

  // User is authenticated, redirect to dashboard
  redirect("/dashboard");
}
