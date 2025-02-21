import { CourseData, CourseSchema } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAllCourses = async (
  query: string,
  limit: number,
  currentPage: number,
): Promise<CourseData> => {
  const response = await axiosInstance.get("/course/list", {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

export const getCoursesByGradeId = async (gradeId: string) => {
  const response = await axiosInstance.get("/course/list", {
    params: {
      page: 0,
      limit: 10,
      gradeId: gradeId,
    },
  });
  return response;
};

export const createNewCourse = async (data: CourseSchema) => {
  const response = await axiosInstance.post("/course/create", data);
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await axiosInstance.get(`/course/details/${courseId}`);
  return response.data.data;
};
