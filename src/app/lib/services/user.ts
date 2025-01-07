import { AccountData, AccountSchema } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const createNewAccount = async (data: AccountSchema) => {
  const response = await axiosInstance.post("/user/admin/add", data);
  // console.log(response);
  return response.data;
};

export const getAllAccount = async (
  query: string,
  currentPage: number,
): Promise<AccountData> => {
  const response = await axiosInstance.get("/user/clerk/get-list-user", {
    params: {
      page: currentPage,
      limit: 5,
      role: "STUDENT",
      filter: query,
    },
  });
  return response.data.data;
};

export const getAvailableTeacher = async (classId: string) => {
  const response = await axiosInstance.get("/user/clerk/available-teachers", {
    params: {
      classId,
    },
  });
  return response.data;
};
