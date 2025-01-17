import { RegisterAccountData } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getRegister = async (
  role: string,
  currentPage: number,
): Promise<RegisterAccountData> => {
  const response = await axiosInstance.get("/register/clerk/waiting-register", {
    params: {
      page: currentPage,
      limit: 5,
      role,
    },
  });
  return response.data.data;
};

export const confirmRegister = async (userId: string) => {
  const response = await axiosInstance.put(
    `/register/admin/confirm?registerId=${userId}`,
    {},
  );
  return response.data;
};

export const rejectRegister = async (userId: string) => {
  const response = await axiosInstance.put(
    `/register/admin/reject?registerId=${userId}`,
    {},
  );
  return response.data;
};
