import { CourseData, CourseDto, CourseSchema } from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const getAllCourses = async (
  query: string,
  limit: number,
  currentPage: number,
): Promise<CourseData> => {
  try {
    const response = await axiosInstance.get("/course/list", {
      params: {
        page: currentPage,
        limit: limit,
        filter: query,
      },
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCoursesByGradeId = async (
  gradeId: string,
): Promise<{
  content: CourseDto[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axiosInstance.get(`/course/list/${gradeId}`, {
      params: {
        page: 0,
        limit: 10,
        filter: "",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createNewCourse = async (data: CourseSchema) => {
  const response = await axiosInstance.post("/course/create", data);
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await axiosInstance.get(`/course/details/${courseId}`);
  return response.data.data;
};
