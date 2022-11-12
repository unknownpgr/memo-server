import type { NextRequest } from "next/server";
// middleware.ts
import { NextResponse } from "next/server";
import { getSession } from "./session/getSession";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.url.includes("/login")) return response;
  const session = await getSession(request, response);
  if (!session.user?.isLoggedIn)
    return NextResponse.redirect(new URL("/login", request.url));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|favicon.ico).*)",
  ],
};
