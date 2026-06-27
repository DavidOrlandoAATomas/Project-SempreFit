// frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // CORRIGIDO: Verificar token no localStorage não é possível no middleware
  // O middleware só acessa cookies. Vamos usar cookies em vez de localStorage
  
  const token = req.cookies.get("accessToken");
  
  console.log("🔐 Middleware - Token no cookie:", token ? "Sim" : "Não");
  console.log("🔐 Middleware - Path:", req.nextUrl.pathname);

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🔐 Middleware - Redirecionando para login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/meals")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/exercises")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/meditations")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*", 
    "/admin/:path*",
    "/meals/:path*",
    "/exercises/:path*",
    "/meditations/:path*"
  ],
};