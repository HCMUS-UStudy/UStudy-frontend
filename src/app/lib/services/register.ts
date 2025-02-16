import { RegisterAccountData } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getRegister = async (
  role: string,
  currentPage: number,
): Promise<RegisterAccountData> => {
  const response = await axiosInstance.get("/register/list-waiting", {
    params: {
      page: currentPage,
      limit: 5,
      role,
    },
  });
  return response.data.data;
};

export const confirmRegister = async (userIds: string[], roleId: string) => {
  const response = await axiosInstance.put(
    `/register/update/accept?roleId=${roleId}`,
    userIds,
  );
  return response.data;
};

export const rejectRegister = async (userIds: string[]) => {
  const response = await axiosInstance.put(
    `/register/update/reject`,
    userIds, // Đưa registerId vào body
  );
  return response.data;
};
