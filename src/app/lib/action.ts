"use server";
import { cookies } from "next/headers";
import { UserData } from "../types/type";
import { redirect } from "next/navigation";

export async function setUserDataCookies(userData: string) {
  console.log("set user data");
  const cookieStore = await cookies();
  cookieStore.set("userData", userData, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
}

export async function setTokensAndUserDataCookies(
  accessToken?: string,
  refreshToken?: string,
  userData?: string,
  permissions?: string,
) {
  const cookieStore = await cookies();
  if (accessToken) {
    cookieStore.set("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
  }
  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  if (userData) {
    cookieStore.set("userData", userData, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });
  }
  if (permissions) {
    cookieStore.set("permissions", permissions, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });
  }
}

export async function getTokensFromCookies(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;
  return { accessToken, refreshToken };
}

export async function getUserDataFromCookies(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get("userData")?.value ?? null;
  return userData !== null ? JSON.parse(userData) : null;
}

export async function handleLogoutCookies() {
  const cookieStore = await cookies();
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userData");
  cookieStore.delete("permissions");
  switch (defaultRoute) {
    case "ADMIN":
      redirect("/admin/login");
    default:
      redirect("/login");
  }
}
