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
    const cacheKey = `Register-${role}-${currentPage}-${queryName}`;
    const response = await axiosInstance.get("/register/list-waiting", {
      params: {
        page: currentPage,
        limit,
        role,
        name: queryName,
      },
      id: cacheKey,
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
  role: "STUDENT" | "TEACHER",
  currentPage: number,
): Promise<RegisterResponse> => {
  try {
    const cacheKey = `Register-${role}-${currentPage}`;
    const response = await axiosInstance.put(
      `/register/update/accept?roleId=${roleId}`,
      userIds,
      {
        cache: {
          update: {
            [cacheKey]: "delete",
          },
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectRegister = async (
  userIds: string[],
  role: "STUDENT" | "TEACHER",
  currentPage: number,
): Promise<RegisterResponse> => {
  try {
    const cacheKey = `Register-${role}-${currentPage}`;
    const response = await axiosInstance.put(
      `/register/update/reject`,
      userIds, // Đưa registerId vào body
      {
        cache: {
          update: {
            [cacheKey]: "delete",
          },
        },
      },
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

export const studentRegister = async (data: StudentRegisterInputs) => {
  try {
    // console.log(data);
    const response = await axiosInstance.post("/register/create/student", {
      name: data.name,
      email: data.email,
      birthday: data.birthday,
      phone: data.phone,
      parentPhone: data.parentPhone,
      address: data.address,
      courses: data.courses,
      grades: [data.grades],
      branchId: data.branchId,
      gender: data.gender,
      classTimes: data.classTimes,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
