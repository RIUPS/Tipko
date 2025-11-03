import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the stats page
  if (pathname.startsWith("/stats")) {
    // Check if user has JWT cookie
    const token = request.cookies.get("jwt");

    if (!token) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Optional: Verify JWT token here if needed
    // You can make a call to your backend to verify the token
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/stats/:path*"],
};
