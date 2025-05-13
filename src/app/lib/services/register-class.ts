import {
  RegisterClassRequest,
  RegisterClassResponse,
} from "@/app/types/register-class";
import axiosInstance from "../axios";

export const studentRegisterClass = async ({
  classId,
}: RegisterClassRequest): Promise<RegisterClassResponse> => {
  try {
    const response = await axiosInstance.post(
      `/register-class/create/${classId}`,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
