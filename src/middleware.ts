import { NextResponse, NextRequest } from "next/server";
import { getTokensFromCookies, getUserDataFromCookies } from "./app/lib/action";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { accessToken } = await getTokensFromCookies();
  const userData = await getUserDataFromCookies();
  if (accessToken) {
    // if(!userData) {
    //   // cập nhật userData
    // }
    if (pathname === "/login" || pathname === "/admin/login") {
      switch (userData?.role.defaultRoute) {
        case "ADMIN":
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        default:
          break;
      }
    }
    return NextResponse.next();
  } else {
    if (
      pathname === "/login" ||
      pathname === "/admin/login" ||
      pathname === "/"
    ) {
      return NextResponse.next();
    }
    let response;
    switch (userData?.role.defaultRoute) {
      case "ADMIN":
        response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("userData");
        return response;
      default:
        response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("userData");
        return response;
    }
  }
}

export const config = {
  matcher: ["/", "/admin/login", "/login", "/admin/:path*"],
};
