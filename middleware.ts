import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        console.log("token",token)
        const pathname = req.nextUrl.pathname;
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname.startsWith("/api/video") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/next_static")
        ) {
          return true;
        }

        return !!token;
      },
    }
  }
);

export const config = {
  matcher: [
    
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",

    "!/login",
    "!/signup",
    "!/register",
    "!/api/auth/:path*",
    "!/next_static/:path*",
    "!/favicon.ico",
    "!/public/:path*",
  ],
};
