import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/clerk/classes/")) {
    const paths = pathname.split("/").filter((path) => path);
    if (
      paths[paths.indexOf("classes") + 1] !== undefined &&
      paths[paths.indexOf("classes") + 2] === undefined
    ) {
      const classId = paths[paths.indexOf("classes") + 1];
      return NextResponse.redirect(
        new URL(`/clerk/classes/${classId}/classManagement`, request.url),
      );
    }
  }
}

export const config = {
  matcher: ["/:path*"],
};
