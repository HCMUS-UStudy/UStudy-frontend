import axiosInstance from "@/app/lib/axios";
import { GradeData, GradeSchema } from "@/app/types";

export const getAllGrades = async (
  query: string,
  limit: number,
  currentPage: number,
): Promise<GradeData> => {
  const response = await axiosInstance.get("/grade/list", {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

export const getGradesByCourseId = async (
  query: string,
  currentPage: number,
  courseId: string,
) => {
  const response = await axiosInstance.get(`/grade/list/${courseId}`, {
    params: {
      page: currentPage,
      limit: 15,
      filter: query,
    },
  });
  return response.data.data;
};

export const getGradeById = async (gradeId: string) => {
  const response = await axiosInstance.get(`/grade/details/${gradeId}`);
  return response.data.data;
};

export const createNewGrade = async (data: GradeSchema) => {
  const response = await axiosInstance.post("/grade/create", data);
  return response.data;
};
