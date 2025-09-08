/**
 * Next.js Middleware for a Multi-Step Authentication Flow
 *
 * Handles three user states:
 * 1. Unauthenticated (no token)
 * 2. Partially Authenticated (has tempToken, needs to select a context)
 * 3. Fully Authenticated (has sessionToken)
 */

// import { NextRequest, NextResponse } from "next/server";

// export default function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const tempToken = req.cookies.get("tempToken")?.value;
//   const sessionToken = req.cookies.get("token")?.value;

//   const publicRoutes = ["/login", "/register", "/forgot-password"];
//   const semiProtectedRoutes = ["/centers", "/account"];

//   // --- PUBLIC ROUTES ---
//   if (publicRoutes.some((p) => pathname.startsWith(p))) {
//     // If user has a session token, they should be redirected to centers
//     if (sessionToken) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/centers"; // Redirect to centers
//       return NextResponse.redirect(url);
//     }
//     // If only has a temporary token, they're in the middle of login
//     if (tempToken) {
//       return NextResponse.redirect(new URL("/centers", req.url));
//     }
//     // If no tokens, they can stay on the public route
//     return NextResponse.next();
//   }

//   if (semiProtectedRoutes.some((p) => pathname.startsWith(p))) {
//     // The only condition for NOT being here is having NO tokens
//     if (!tempToken && !sessionToken) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     // If has any token, they can access
//     return NextResponse.next();
//   }

//   // --- LOGIC FOR ALL OTHER (PROTECTED) ROUTES ---
//   // If no session token, they can't access any other route
//   if (!sessionToken) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     url.searchParams.set("from", pathname); // Save where they wanted to go
//     return NextResponse.redirect(url);
//   }

//   // If we got here, they have a valid session token and can proceed
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const tempToken = req.cookies.get("tempToken")?.value;
  const sessionToken = req.cookies.get("sessionToken")?.value; // Asegúrate de que el nombre sea 'sessionToken' o el que uses

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const contextSelectionRoute = "/centers";
  const dashboardRoute = "/dashboard";

  const isPublic = publicRoutes.some((p) => pathname.startsWith(p));
  const isContextSelection = pathname.startsWith(contextSelectionRoute);

  // --- 1. Lógica para Rutas Públicas ---
  if (isPublic) {
    if (sessionToken) {
      // Un usuario con sesión completa no debe ver el login
      return NextResponse.redirect(new URL(dashboardRoute, req.url));
    }
    if (tempToken) {
      // Un usuario a mitad del login debe ir a seleccionar contexto
      return NextResponse.redirect(new URL(contextSelectionRoute, req.url));
    }
    // Si no hay token, puede quedarse.
    return NextResponse.next();
  }

  // --- 2. Lógica para la Página de Selección de Contexto ---
  if (isContextSelection) {
    // Para estar aquí, se necesita AL MENOS un token
    if (!tempToken && !sessionToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Si tiene cualquier token, se le permite el acceso.
    return NextResponse.next();
  }

  // --- 3. Lógica para TODAS LAS DEMÁS PÁGINAS (Protegidas) ---
  // Si llegamos aquí, la ruta es totalmente protegida (ej: /dashboard, /patients).
  // Requiere sí o sí un token de sesión final.
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);

    // Si solo tiene un tempToken, lo forzamos a seleccionar centro
    if (tempToken) {
      return NextResponse.redirect(new URL(contextSelectionRoute, req.url));
    }

    // Si no tiene ningún token, al login.
    return NextResponse.redirect(loginUrl);
  }

  // Si tiene token final, puede continuar.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
