import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    );
  }

  // Skip Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Detect locale from first URL segment
  const firstSegment = pathname.split("/")[1];

  const requestHeaders = new Headers(request.headers);

  if (isLocale(firstSegment)) {
    requestHeaders.set("x-locale", firstSegment);
  } else {
    requestHeaders.set("x-locale", defaultLocale);
  }

  // Existing admin authentication
  if (pathname.startsWith("/admin")) {
    if (!PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      const token = request.cookies.get("rootym_admin_token")?.value;

      if (!token) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};