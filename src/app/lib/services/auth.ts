import axiosInstance from "@/app/lib/axios";
import { AuthResponse, ChangePasswordPayload } from "@/app/types";

export const login = async (
  username: string,
  password: string,
  isUser: boolean,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
      isUser,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleRefreshToken = async (
  refreshToken: string | null,
): Promise<AuthResponse | null> => {
  try {
    const response = await axiosInstance.post("/auth/refresh-token", {
      refreshToken: refreshToken,
    });
    if (response.status === 403) {
      return null;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get("/auth/verify-token");
    return response.data.statusCode === "OK";
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: ChangePasswordPayload) => {
  try {
    const response = await axiosInstance.put("/api/auth/change-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
