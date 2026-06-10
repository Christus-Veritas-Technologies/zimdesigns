import { NextRequest, NextResponse } from "next/server";

// These values live only in server-side code — never sent to the browser.
const ADMIN_COOKIE = "zd_admin";
const ADMIN_TOKEN = "zdtok-9kq27p-v1";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get(ADMIN_COOKIE)?.value;
    if (session !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
