import axiosInstance from "@/app/lib/axios";
import { AuthResponse } from "@/app/types";

export const login = async (
  genId: string,
  password: string,
  isUser: boolean,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      genId: genId,
      password: password,
      isUser: isUser,
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
