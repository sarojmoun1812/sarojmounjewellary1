import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes (except auth and init)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth") &&
    !pathname.startsWith("/api/admin/init")
  ) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
