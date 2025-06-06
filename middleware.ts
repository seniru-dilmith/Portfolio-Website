import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Redirect www to non-www
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.replace("www.", "");
    return NextResponse.redirect(url);
  }

  // Protect admin routes except for the login page
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const token = req.cookies.get("accessToken")?.value;

    // If no token present, redirect to the admin login page
    if (!token) {
      url.pathname = "/admin/login";
      url.searchParams.set("from", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
