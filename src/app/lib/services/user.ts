import { AccountData, AccountItem, DeleteAccountResponse } from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const createNewAccount = async (data: AccountItem) => {
  const response = await axiosInstance.post("/user/create", data);
  return response.data;
};

export const getAllAccount = async (
  query: string,
  limit: number,
  roleQuery: string,
  currentPage: number,
): Promise<AccountData> => {
  try {
    const response = await axiosInstance.get("/user/list", {
      params: {
        page: currentPage,
        limit: limit,
        role: roleQuery,
        filterNameOrGenId: query,
      },
    });
    console.log("response", response);
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
): Promise<DeleteAccountResponse> => {
  try {
    const response = await axiosInstance.delete(`/user/delete/${userId}`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountByBranch = async (
  branchId: string,
  query: string,
  limit: number,
  roleQuery: string,
  currentPage: number,
): Promise<AccountData> => {
  try {
    const response = await axiosInstance.get(`/user/list/${branchId}`, {
      params: {
        page: currentPage,
        limit: limit,
        role: roleQuery,
        filterNameOrGenId: query,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
