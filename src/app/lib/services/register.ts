import {
  RegisterAccountData,
  RegisterClassData,
  RegisterResponse,
  TeacherRegister,
} from "@/app/types";
import axiosInstance from "@/app/lib/axios";
import { StudentRegisterInputs } from "@/app/register/page";

export const getRegister = async (
  role: "STUDENT" | "TEACHER",
  limit = 5,
  currentPage: number,
  queryName: string | null,
): Promise<RegisterAccountData> => {
  try {
    const response = await axiosInstance.get("/register/list-waiting", {
      params: {
        page: currentPage,
        limit,
        role,
        name: queryName,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getStuClassRegister = async (
  classId: string,
  currentPage: number,
  limit = 5,
): Promise<RegisterClassData> => {
  try {
    const response = await axiosInstance.get(
      `/register/list-student-waiting/${classId}`,
      {
        params: {
          page: currentPage,
          limit,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const confirmRegister = async (
  userIds: string[],
  roleId: string,
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.put(
      `/register/update/accept?roleId=${roleId}`,
      userIds,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectRegister = async (
  userIds: string[],
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.put(
      `/register/update/reject`,
      userIds, // Đưa registerId vào body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const teacherRegister = async (data: TeacherRegister) => {
  try {
    const response = await axiosInstance.post("/register/create/teacher", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const studentRegister = async (
  data: StudentRegisterInputs,
): Promise<RegisterResponse> => {
  try {
    // console.log(data);
    const response = await axiosInstance.post("/register/create", {
      username: data.username,
      password: data.password,
      confirmPassword: data.retypePassword,
      // name: data.name,
      email: data.email,
      // birthday: data.birthday,
      // phone: data.phone,
      // parentPhone: data.parentPhone,
      // address: data.address,
      // gender: data.gender,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
