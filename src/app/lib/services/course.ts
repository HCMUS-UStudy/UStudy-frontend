import {
  BasePaginationResponse,
  CourseDto,
  CourseItem,
  CourseSchema,
  CreateCourseResponse,
} from "@/app/types";
import axiosInstance from "@/app/lib/axios";

export const getAllCourses = async (
  query: string,
  limit: number,
  currentPage: number,
): Promise<BasePaginationResponse<CourseItem>> => {
  try {
    const response = await axiosInstance.get("/course/list", {
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

export const getCoursesByGradeId = async (
  gradeId: string,
): Promise<BasePaginationResponse<CourseDto>> => {
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

export const createNewCourse = async (
  data: CourseSchema,
): Promise<CreateCourseResponse> => {
  try {
    const response = await axiosInstance.post("/course/create", data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (courseId: string) => {
  const response = await axiosInstance.get(`/course/details/${courseId}`);
  return response.data.data;
};
