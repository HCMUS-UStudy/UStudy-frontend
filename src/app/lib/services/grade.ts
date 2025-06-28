import axiosInstance from "@/app/lib/axios";
import { Grade, GradeData, GradeResponse } from "@/app/types";
import { CreateGradeInputs } from "@/app/ui/components/admin/grades/AddGradeModal";

export const getAllGrades = async (
  query: string,
  limit: number,
  currentPage: number,
): Promise<GradeData> => {
  try {
    const response = await axiosInstance.get("/grade/list", {
      params: {
        page: currentPage,
        limit: limit,
        filter: query,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getGradesByCourseId = async (
  query: string,
  currentPage: number,
  courseId: string,
): Promise<GradeData> => {
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

export const createNewGrade = async (
  data: CreateGradeInputs,
): Promise<Grade> => {
  try {
    const response = await axiosInstance.post("/grade/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGrade = async ({
  gradeId,
  name,
}: {
  gradeId: string;
  name: string;
}): Promise<GradeResponse> => {
  try {
    const response = await axiosInstance.put(`/grade/update/${gradeId}`, {
      name,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
