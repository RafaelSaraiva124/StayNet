import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const token = await getToken({ req: request, secret });

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    if (token) {
      url.pathname = "/discover";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const privateRoutes = ["/dashboard", "/controlpanel", "/cart", "/discover"];
  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard") && token.role !== "Admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/controlpanel") &&
      token.role !== "Partner" &&
      token.role !== "Admin"
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/controlpanel/:path*",
    "/cart/:path*",
    "/discover/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
