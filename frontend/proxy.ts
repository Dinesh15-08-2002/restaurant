import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from login page to admin menu
  if (pathname === "/admin/login" && token) {
    const adminMenuUrl = new URL("/admin/menu", request.url);
    return NextResponse.redirect(adminMenuUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

