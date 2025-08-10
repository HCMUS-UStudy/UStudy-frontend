import axiosInstance from "@/app/lib/axios";
import {
  AuthResponse,
  ChangePasswordPayload,
  VerifyOtpPayload,
  GenerateOtpPayload,
  ForgotPasswordWithOtpPayload,
  SimpleApiResponse,
} from "@/app/types/auth";

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

export const loginByGoogle = async () => {
  try {
    const response = await axiosInstance.get("/auth/google/login");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByGoogle = async (
  userId: string,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.get(`/auth/auth-response/${userId}`);
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
    const response = await axiosInstance.put("/auth/change-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (
  data: VerifyOtpPayload,
): Promise<SimpleApiResponse> => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateOtp = async (
  data: GenerateOtpPayload,
): Promise<SimpleApiResponse> => {
  try {
    const response = await axiosInstance.post("/auth/generate-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordWithOtp = async (
  data: ForgotPasswordWithOtpPayload,
): Promise<SimpleApiResponse> => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
