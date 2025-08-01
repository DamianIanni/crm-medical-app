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

  // Si no hay token y quiere acceder al dashboard, redirige a login
  if (!token && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
