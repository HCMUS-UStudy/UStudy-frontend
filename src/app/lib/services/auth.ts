import axiosInstance from "@/app/lib/axios";

export const userLogin = async (genId: string, password: string) => {
  const response = await axiosInstance.post("/auth/user/login", {
    genId: genId,
    password: password,
  });
  return response.data;
};

export const adminLogin = async (genId: string, password: string) => {
  const response = await axiosInstance.post("/auth/admin/login", {
    genId: genId,
    password: password,
  });
  return response.data;
};

export const handleRefreshToken = async (refreshToken: string | null) => {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken: refreshToken,
  });
  return response.data;
};
