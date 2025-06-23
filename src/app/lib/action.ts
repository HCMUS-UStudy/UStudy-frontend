"use server";
import { cookies } from "next/headers";
import { UserData } from "../types";
import { redirect } from "next/navigation";
import { decodeToken } from "./axios";

export async function encrypt(plainData: string, encryptionKey: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(plainData);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(encryptionKey, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    encodedData,
  );
  return {
    encryptedData: Buffer.from(encryptedData).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
}

export async function decrypt(
  encryptedData: string,
  iv: string,
  encryptionKey: string,
) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(encryptionKey, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
  try {
    const encodedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: Buffer.from(iv, "base64"),
      },
      cryptoKey,
      Buffer.from(encryptedData, "base64"),
    );
    return new TextDecoder().decode(encodedData);
  } catch (error) {
    console.log(error);
  }
}

export async function setUserDataCookies(userData: string) {
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
  creator?: string,
) {
  const cookieStore = await cookies();
  const encryptionKey = process.env.COOKIES_SECRET_KEY || "";
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
    try {
      const { encryptedData, iv } = await encrypt(userData, encryptionKey);
      cookieStore.set("userData", encryptedData, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
      });
      cookieStore.set("userData_iv", iv, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (error) {
      throw error;
    }
  }
  if (permissions) {
    try {
      const { encryptedData, iv } = await encrypt(permissions, encryptionKey);
      cookieStore.set("permissions", encryptedData, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("permissions_iv", iv, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (error) {
      console.error("Error encrypting permissions:", error);
    }
  }
  if (creator) {
    cookieStore.set("creator", creator, {
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
  try {
    const cookieStore = await cookies();
    const encryptionKey = process.env.COOKIES_SECRET_KEY || "";
    const encryptedData = cookieStore.get("userData")?.value;
    const iv = cookieStore.get("userData_iv")?.value;
    if (encryptedData && iv) {
      const decryptedData = await decrypt(encryptedData, iv, encryptionKey);
      return decryptedData !== undefined ? JSON.parse(decryptedData) : null;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function getCreatorFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get("creator")?.value ?? null;
  return userData !== null ? JSON.parse(userData) : null;
}

export async function handleLogoutCookies() {
  const cookieStore = await cookies();
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
  switch (defaultRoute) {
    case "ADMIN":
      redirect("/admin/login");
    default:
      redirect("/login");
  }
}

export async function getPermissions(): Promise<string[]> {
  const cookieStore = await cookies();
  const encryptedPermissions = cookieStore.get("permissions")?.value;
  const iv = cookieStore.get("permissions_iv")?.value;

  if (encryptedPermissions && iv) {
    try {
      const encryptionKey = process.env.COOKIES_SECRET_KEY || "";
      const decryptedPermissions = await decrypt(
        encryptedPermissions,
        iv,
        encryptionKey,
      );
      return decryptedPermissions ? JSON.parse(decryptedPermissions) : [];
    } catch (error) {
      console.error("Error decrypting permissions:", error);
      return [];
    }
  }
  return [];
}

export async function getUserId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    if (accessToken) {
      const userId = decodeToken(accessToken).userId;
      return userId ?? "";
    }
    return "";
  } catch (error) {
    throw error;
  }
}
