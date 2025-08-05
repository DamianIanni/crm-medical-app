/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware handles JWT token verification and route protection for the application.
 * It runs on specified routes (configured in the matcher) and ensures users are properly
 * authenticated before accessing protected dashboard routes.
 */

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const selectedCenter = req.cookies.get("selectedCenter")?.value;

  // If no token and trying to access dashboard, redirect to login
  if (!token && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If has token but no selected center, and trying to access dashboard routes
  // redirect to select-center page (outside dashboard)
  if (token && !selectedCenter && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/centers";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/centers/:path*"],
};
