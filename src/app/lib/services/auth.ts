import axiosInstance from "@/app/lib/axios";

export const login = async (
  genId: string,
  password: string,
  isUser: boolean,
) => {
  const response = await axiosInstance.post("/auth/login", {
    genId: genId,
    password: password,
    isUser: isUser,
  });
  return response.data;
};

export const handleRefreshToken = async (refreshToken: string | null) => {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken: refreshToken,
  });
  return response.data;
};
