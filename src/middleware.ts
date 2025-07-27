import { NextResponse, NextRequest } from "next/server";
import {
  getTokensFromCookies,
  getUserDataFromCookies,
  handleLogoutCookies,
} from "./app/lib/action";
import { handleRefreshToken } from "./app/lib/services/auth";
import { getPermissions } from "./app/lib/services";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { accessToken, refreshToken } = await getTokensFromCookies();
  const userData = await getUserDataFromCookies();
  let permissions: string[] = [];
  let response: NextResponse;

  const referer = request.headers.get("referer");

  if (!accessToken) {
    if (
      pathname === "/verify-token" &&
      (!referer || !referer.includes("/forgot-password"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (
      pathname === "/reset-password" &&
      (!referer || !referer.includes("/verify-token"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      pathname === "/admin/verify-token" &&
      (!referer || !referer.includes("/admin/forgot-password"))
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (
      pathname === "/admin/reset-password" &&
      (!referer || !referer.includes("/admin/verify-token"))
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (accessToken) {
    // if(!userData) {
    //   // cập nhật userData
    // }
    // const isValidToken = await verifyToken();
    // permissions = await getPermissions();
    permissions = await getPermissions();
    const isValidToken = true;

    if (!isValidToken) {
      switch (userData?.role.defaultRoute) {
        case "ADMIN":
          response = NextResponse.redirect(
            new URL("/admin/login", request.url),
          );
          response.cookies.getAll().forEach((cookie) => {
            response.cookies.delete(cookie.name);
          });
          return response;
        default:
          response = NextResponse.redirect(new URL("/login", request.url));
          response.cookies.getAll().forEach((cookie) => {
            response.cookies.delete(cookie.name);
          });
          return response;
      }
    }
    const defaultRoute = userData?.role.defaultRoute;
    if (
      pathname === "/login" ||
      pathname === "/admin/login" ||
      pathname === "/forgot-password" ||
      pathname === "/admin/forgot-password" ||
      pathname === "/verify-token" ||
      pathname === "/admin/verify-token" ||
      pathname === "/reset-password" ||
      pathname === "/admin/reset-password"
    ) {
      switch (defaultRoute) {
        case "TEACHER":
          return NextResponse.redirect(
            new URL("/teacher/classes", request.url),
          );
        case "STUDENT":
          return NextResponse.redirect(new URL("/member/home", request.url));
        case "PARENT":
          return NextResponse.redirect(new URL("/member/tuition", request.url));
        case "ADMIN":
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        default:
          break;
      }
    }
    if (pathname.startsWith("/teacher")) {
      if (defaultRoute !== "TEACHER") {
        return NextResponse.redirect(new URL("/login", request.url));
      } else {
        if (!permissions.some((path) => pathname.startsWith(path))) {
          return NextResponse.redirect(
            new URL("/teacher/classes", request.url),
          );
        }
      }
    }
    if (pathname.startsWith("/admin")) {
      if (defaultRoute !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if (!permissions.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    if (pathname.startsWith("/member")) {
      if (defaultRoute !== "STUDENT" && defaultRoute !== "PARENT") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const classPageRegex = /^\/member\/classes\/([^\/]+)$/;
      if (classPageRegex.test(pathname)) {
        return NextResponse.redirect(
          new URL(`${pathname}/assignment`, request.url),
        );
      }
      // Allow access to attendance without permission check
      if (pathname.startsWith("/member/attendance")) {
        return NextResponse.next();
      }
      if (!permissions.some((path) => pathname.startsWith(path))) {
        if (defaultRoute === "STUDENT") {
          if (!userData?.hadClass) {
            return NextResponse.redirect(
              new URL("/member/class-register", request.url),
            );
          } else {
            return NextResponse.redirect(
              new URL("/member/classes", request.url),
            );
          }
        }
        return NextResponse.redirect(new URL("/member/home", request.url));
      }
    }
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    if (
      pathname === "/login" ||
      pathname === "/admin/login" ||
      pathname === "/forgot-password" ||
      pathname === "/admin/forgot-password" ||
      pathname === "/verify-token" ||
      pathname === "/admin/verify-token" ||
      pathname === "/reset-password" ||
      pathname === "/admin/reset-password" ||
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
  matcher: [
    "/",
    "/admin/login",
    "/login",
    "/forgot-password",
    "/admin/forgot-password",
    "/verify-token",
    "/admin/verify-token",
    "/reset-password",
    "/admin/reset-password",
    "/admin/:path*",
    "/teacher/:path*",
    "/member/:path*",
  ],
};

// import { NextResponse } from "next/server";

// export async function middleware() {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",
//     "/admin/login",
//     "/login",
//     "/admin/:path*",
//     "/teacher/:path*",
//     "/member/:path*",
//   ],
// };
