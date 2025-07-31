/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login"];

export function requireAuth(user: any, pathname: string, req: NextRequest) {
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!user && !isPublic) {
    console.log("User is not authenticated and trying to access a");

    return redirectTo("/login", req);
  }

  if (user && pathname === "/login") {
    console.log("User is authenticated and trying to access the login page");

    return redirectTo("/dashboard", req);
  }
  console.log("User is authenticated and trying to access a protected path");

  return null;
}

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.url));
}
