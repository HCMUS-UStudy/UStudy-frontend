import { AccountData, AccountSchema, DeleteAccountResponse } from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const createNewAccount = async (data: AccountSchema) => {
  const response = await axiosInstance.post("/user/create", data);
  // console.log(response);
  return response.data;
};

export const getAllAccount = async (
  query: string,
  limit: number,
  roleQuery: string,
  currentPage: number,
): Promise<AccountData> => {
  try {
    const cacheKey = `Accounts_${query}_${limit}_${roleQuery}_${currentPage}`;
    console.log(cacheKey);
    const response = await axiosInstance.get("/user/list", {
      params: {
        page: currentPage,
        limit: limit,
        role: roleQuery,
        filterNameOrGenId: query,
        classId: "",
      },
      id: cacheKey,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
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

export const deleteUser = async (
  userId: string,
  query: string,
  limit: number,
  roleQuery: string,
  currentPage: number,
): Promise<DeleteAccountResponse> => {
  try {
    const cacheKey = `Accounts_${query}_${limit}_${roleQuery}_${currentPage}`;
    console.log(cacheKey);
    const response = await axiosInstance.delete(`/user/delete/${userId}`, {
      cache: {
        update: {
          [cacheKey]: "delete",
        },
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
