import { NextResponse, NextRequest } from "next/server";
import {
  getTokensFromCookies,
  getUserDataFromCookies,
  handleLogoutCookies,
} from "./app/lib/action";
import { handleRefreshToken } from "./app/lib/services/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { accessToken, refreshToken } = await getTokensFromCookies();
  const userData = await getUserDataFromCookies();
  let response;
  if (accessToken) {
    // if(!userData) {
    //   // cập nhật userData
    // }
    const defaultRoute = userData?.role.defaultRoute;
    if (pathname === "/login" || pathname === "/admin/login") {
      switch (defaultRoute) {
        case "TEACHER":
          return NextResponse.redirect(
            new URL("/teacher/classes", request.url),
          );
        case "STUDENT":
          return NextResponse.redirect(new URL("/student/home", request.url));
        case "PARENT":
          // return NextResponse.redirect(new URL("/student/home", request.url));
          break;
        case "ADMIN":
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        default:
          break;
      }
    }
    if (pathname.startsWith("/teacher") && defaultRoute !== "TEACHER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/student") && defaultRoute !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/parent") && defaultRoute !== "PARENT") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/admin") && defaultRoute !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
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
    if (refreshToken) {
      const authResponse = await handleRefreshToken(refreshToken);
      if (!authResponse) {
        await handleLogoutCookies();
      } else {
        response = NextResponse.next();
        response.cookies.set("accessToken", authResponse.data.access_token);
        response.cookies.set("refreshToken", authResponse.data.refresh_token);
        response.cookies.set(
          "userData",
          JSON.stringify(authResponse.data.user),
        );
        return response;
      }
    } else {
      switch (userData?.role.defaultRoute) {
        case "ADMIN":
          response = NextResponse.redirect(
            new URL("/admin/login", request.url),
          );
          response.cookies.delete("accessToken");
          response.cookies.delete("refreshToken");
          response.cookies.delete("userData");
          return response;
        default:
          response = NextResponse.redirect(new URL("/login", request.url));
          response.cookies.delete("accessToken");
          response.cookies.delete("refreshToken");
          response.cookies.delete("userData");
          return response;
      }
    }
  }
}

export const config = {
  matcher: ["/", "/admin/login", "/login", "/admin/:path*", "/teacher/:path*"],
};
