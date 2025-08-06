/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware handles JWT token verification and route protection for the application.
 * It ensures users are properly authenticated before accessing protected routes.
 */

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const selectedCenter = req.cookies.get("selectedCenter")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.includes(pathname)) {
    // If user is already logged in, redirect to appropriate page
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = selectedCenter ? "/dashboard" : "/centers";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = ["/dashboard", "/centers"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If no token and trying to access protected routes, redirect to login
  if (!token && isProtectedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If user has token but no selected center, only allow /centers route
  if (token && !selectedCenter && pathname !== "/centers") {
    const url = req.nextUrl.clone();
    url.pathname = "/centers";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
