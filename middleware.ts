import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge gate in front of the admin area.
 *
 * This is a cheap filter, not the authorisation check. Middleware runs on the
 * Edge runtime, where Prisma cannot reach the database, so there is no way here
 * to confirm a token corresponds to a live session. Anyone can set
 * `admin_session=anything` in their own browser and get past this file.
 *
 * The real check is getCurrentAdmin() — it loads the session, verifies it has
 * not expired and that the account is still active. Every admin page and every
 * /api/admin handler calls it before touching customer data, and that is what
 * actually protects the data. What this file adds is turning away obvious junk
 * before it costs a database round trip, and sending a signed-out shopkeeper to
 * the login page instead of a blank screen.
 */

/** Tokens are 32 random bytes rendered as hex by generateToken(). */
const TOKEN_PATTERN = /^[0-9a-f]{64}$/;

function hasWellFormedToken(request: NextRequest): boolean {
  const token = request.cookies.get("admin_session")?.value;
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!hasWellFormedToken(request)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // /api/admin/auth is the login route itself and /api/admin/init is the
  // one-time bootstrap; both guard themselves and must stay reachable.
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth") &&
    !pathname.startsWith("/api/admin/init")
  ) {
    if (!hasWellFormedToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
