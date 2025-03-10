import {
  RegisterAccountData,
  RegisterClassData,
  TeacherRegister,
} from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";
import { StudentRegisterInputs } from "@/app/register/page";

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

export const getStuClassRegister = async (
  classId: string,
  currentPage: number,
): Promise<RegisterClassData> => {
  const response = await axiosInstance.get(
    `/register/list-student-waiting/${classId}`,
    {
      params: {
        page: currentPage,
        limit: 5,
      },
    },
  );
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

export const teacherRegister = async (data: TeacherRegister) => {
  try {
    const response = await axiosInstance.post("/register/create/teacher", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const studentRegister = async (data: StudentRegisterInputs) => {
  try {
    // console.log(data);
    const response = await axiosInstance.post("/register/create/student", data);
    return response;
  } catch (error) {
    throw error;
  }
};
