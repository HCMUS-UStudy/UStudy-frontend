import { AccountData, AccountSchema } from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const createNewAccount = async (data: AccountSchema) => {
  const response = await axiosInstance.post("/user/create", data);
  // console.log(response);
  return response.data;
};

export const getAllAccount = async (
  query: string,
  roleQuery: string,
  currentPage: number,
): Promise<AccountData> => {
  const response = await axiosInstance.get("/user/list", {
    params: {
      page: currentPage,
      limit: 5,
      role: roleQuery,
      filterNameOrGenId: query,
      classId: "",
    },
  });
  return response.data.data;
};

export const getAvailableTeacher = async (classId: string) => {
  const response = await axiosInstance.get("/user/list-available-teachers", {
    params: {
      classId,
    },
  });
  return response.data;
};

export const getListUserDetail = async (userId: string) => {
  const response = await axiosInstance.get(`/user/details/${userId}`);
  return response.data;
};
