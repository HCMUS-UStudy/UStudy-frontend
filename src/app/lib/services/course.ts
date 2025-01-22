import { CourseData, CourseSchema } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAllCourses = async (
  query: string,
  currentPage: number,
): Promise<CourseData> => {
  const response = await axiosInstance.get("/course/admin/get-list-course", {
    params: {
      page: currentPage,
      limit: 5,
      filter: query,
    },
  });
  return response.data.data;
};

export const getCoursesByGradeId = async (gradeId: string) => {
  const response = await axiosInstance.get(
    "/course/clerk/get-course-by-grade-id",
    {
      params: {
        page: 0,
        limit: 10,
        gradeId: gradeId,
      },
    },
  );
  return response;
};

export const createNewCourse = async (data: CourseSchema) => {
  const response = await axiosInstance.post("/course/admin/add", data);
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await axiosInstance.get(`/course/clerk/${courseId}`);
  return response.data.data;
};
