import { NextResponse } from "next/server";

// Sends people to the right page before anything renders, so signed-in users
// never see the marketing page and signed-out users never see the dashboard.
//
// This only looks for the session cookie; it can't check that it's valid. The
// dashboard asks the API for the real answer and clears a stale cookie itself.
export function proxy(request) {
  const signedIn = request.cookies.has("sr_token");
  const { pathname } = request.nextUrl;

  if (signedIn && ["/", "/signin", "/signup"].includes(pathname)) {
    const url = new URL("/dashboard", request.url);
    url.search = request.nextUrl.search; // keeps ?template=<id>
    return NextResponse.redirect(url);
  }
  if (!signedIn && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/dashboard", "/signin", "/signup"] };
