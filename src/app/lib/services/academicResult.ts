import { AcademicResult } from "@/app/types";
import axiosInstance from "../axios";

export const getAcademicResult = async (
  classId: string,
  page: number,
  limit: number,
): Promise<AcademicResult> => {
  try {
    const response = await axiosInstance.get(
      `/academic-result/details/${classId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
