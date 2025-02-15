import axiosInstance from "@/app/lib/axios";

export const userLogin = async (genId: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    genId: genId,
    password: password,
    isUser: true,
  });
  return response.data;
};

export const adminLogin = async (genId: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      genId: genId,
      password: password,
      isUser: false,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleRefreshToken = async (refreshToken: string | null) => {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken: refreshToken,
  });
  return response.data;
};
