import {
  AccountData,
  AccountItem,
  DeleteAccountResponse,
  UpdateProfilePayload,
  UserProfile,
} from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const createNewAccount = async (
  data: Pick<
    AccountItem,
    "name" | "phone" | "email" | "address" | "birthday" | "gender"
  > & { roleId: string },
): Promise<AccountItem> => {
  try {
    const response = await axiosInstance.post("/user/create", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      birthday: data.birthday,
      gender: data.gender,
      roleId: data.roleId,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
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

export const getFreeUsers = async (
  classId: string,
  limit: number,
  route: string,
  currentPage: number,
): Promise<AccountData> => {
  try {
    const response = await axiosInstance.get(`/user/free-users/${classId}`, {
      params: {
        page: currentPage,
        limit: limit,
        route: route,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  try {
    const response = await axiosInstance.put("/user/update-profile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.put("/user/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePathAvatar = async (pathFile: string) => {
  try {
    const response = await axiosInstance.put(
      `/user/update-path-avatar?pathFile=${pathFile}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
