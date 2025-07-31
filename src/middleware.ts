/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware handles JWT token verification and route protection for the application.
 * It runs on specified routes (configured in the matcher) and ensures users are properly
 * authenticated before accessing protected dashboard routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/api/jwtUtil";
import { User } from "./types/user";
import { requireAuth } from "./lib/middlewareHelpers/requireAuthHelper";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let user: Partial<User> = token ? await verifyJWT(token) : null;

  if (token && token.split(".").length === 3) {
    user = await verifyJWT(token);
  }

  const authRedirect = requireAuth(user, pathname, req);
  if (authRedirect) return authRedirect;

  return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: ["/dashboard/:path*"],
};
