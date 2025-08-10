// src/app/lib/services/rating.ts
import axiosInstance from "@/app/lib/axios";
import {
  CreateRatingRequest,
  ApiResponse,
  TeacherRatingOverview,
  TeacherRatingDetail,
  CourseGradeRatingOverview,
  CourseGradeRatingDetail,
  PaginatedResponse,
} from "@/app/types/rating";

// POST /api/rating/create
export const createRating = async (body: CreateRatingRequest) => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `/rating/create`,
      body,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /api/rating/list-teachers
export const getListTeacherRatings = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<TeacherRatingOverview>>
    >(`/rating/list-teachers`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /api/rating/list-teachers/details
export const getTeacherRatingsDetails = async (
  teacherId: string,
  page: number,
  limit: number,
) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<TeacherRatingDetail>>
    >(`/rating/list-teachers/details`, {
      params: { teacherId, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /api/rating/list-course-grades
export const getListCourseGradeRatings = async (
  page: number,
  limit: number,
) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<CourseGradeRatingOverview>>
    >(`/rating/list-course-grades`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /api/rating/list-course-grades/details
export const getCourseGradeRatingsDetails = async (
  courseId: string,
  gradeId: string,
  page: number,
  limit: number,
) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<CourseGradeRatingDetail>>
    >(`/rating/list-course-grades/details`, {
      params: { courseId, gradeId, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
