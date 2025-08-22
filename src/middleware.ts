// /**
//  * Next.js Middleware for Authentication and Route Protection
//  *
//  * This middleware handles JWT token verification and route protection for the application.
//  * It ensures users are properly authenticated before accessing protected routes.
//  */

// import { NextRequest, NextResponse } from "next/server";

// export default function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("token")?.value;
//   const selectedCenter = req.cookies.get("selectedCenter")?.value;

//   // Public routes that don't require authentication
//   const publicRoutes = ["/login", "/register", "/forgot-password"];
//   if (publicRoutes.includes(pathname)) {
//     // If user is already logged in, redirect to appropriate page
//     if (token) {
//       const url = req.nextUrl.clone();
//       url.pathname = selectedCenter ? "/dashboard" : "/centers";
//       return NextResponse.redirect(url);
//     }
//     return NextResponse.next();
//   }

//   // Protected routes
//   const protectedRoutes = ["/dashboard", "/centers"];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//   // If no token and trying to access protected routes, redirect to login
//   if (!token && isProtectedRoute) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     url.searchParams.set("from", pathname);
//     return NextResponse.redirect(url);
//   }

//   // If user has token but no selected center, only allow /centers route
//   if (token && !selectedCenter && pathname !== "/centers") {
//     const url = req.nextUrl.clone();
//     url.pathname = "/centers";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

/**
 * Next.js Middleware for a Multi-Step Authentication Flow
 *
 * Handles three user states:
 * 1. Unauthenticated (no token)
 * 2. Partially Authenticated (has tempToken, needs to select a context)
 * 3. Fully Authenticated (has sessionToken)
 */

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Lee ambos tokens de las cookies
  const tempToken = req.cookies.get("tempToken")?.value;
  const sessionToken = req.cookies.get("token")?.value; // Renombrado para mayor claridad

  // 2. Define las rutas públicas y la ruta de selección de contexto
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const semiProtectedRoutes = ["/centers", "/account"];

  // --- LÓGICA PARA RUTAS PÚBLICAS ---
  if (publicRoutes.some((p) => pathname.startsWith(p))) {
    // Si el usuario ya tiene una sesión completa, no debe estar aquí.
    if (sessionToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/centers"; // Lo mandamos al centers
      return NextResponse.redirect(url);
    }
    // Si solo tiene un token temporal, está a mitad del login.
    if (tempToken) {
      // const url = req.nextUrl.clone();
      // url.pathname = contextSelectionRoute; // Lo mandamos a seleccionar contexto
      // return NextResponse.redirect(url);
      return NextResponse.redirect(new URL("/centers", req.url));
    }
    // Si no tiene ningún token, puede quedarse en la ruta pública.
    return NextResponse.next();
  }

  // --- LÓGICA PARA LA RUTA DE SELECCIÓN DE CONTEXTO (CORREGIDA) ---
  if (semiProtectedRoutes.some((p) => pathname.startsWith(p))) {
    // La única condición para NO estar aquí es no tener NINGÚN token
    if (!tempToken && !sessionToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Si tiene cualquier token, se le permite el acceso
    return NextResponse.next();
  }

  // --- LÓGICA PARA TODAS LAS DEMÁS RUTAS (PROTEGIDAS) ---
  // Si no tiene el token de sesión final, no puede acceder a ninguna otra ruta.
  if (!sessionToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname); // Guardamos a dónde quería ir
    return NextResponse.redirect(url);
  }

  // Si llegó hasta aquí, tiene un token de sesión final y puede continuar.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
