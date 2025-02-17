import { RegisterAccountData, TeacherRegister } from "@/app/types/type";
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

export const confirmRegister = async (userId: string) => {
  const response = await axiosInstance.put(
    `/register/update/accept?registerId=${userId}`,
    {},
  );
  return response.data;
};

export const rejectRegister = async (userId: string) => {
  const response = await axiosInstance.put(
    `/register/update/reject?registerId=${userId}`,
    {},
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
