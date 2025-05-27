import axiosInstance from "@/app/lib/axios";
import { ClassSchedule, ClassScheduleItem } from "@/app/types";
import { BasePaginationResponse } from "@/app/types/common";

export const getAllClassSchedule = async (
  classId: string,
  month: number,
  year: number,
): Promise<ClassScheduleItem> => {
  const response = await axiosInstance.get(
    `/class-schedule/list/class/${classId}`,
    {
      params: {
        month: month,
        year: year,
      },
    },
  );
  return response.data.data;
};

export const getClassSchedule = async (
  classId: string,
  page: number,
  limit: number,
): Promise<BasePaginationResponse<ClassSchedule>> => {
  try {
    const response = await axiosInstance.get(
      `/class-schedule/get-class-schedule/${classId}`,
      {
        params: {
          page: page,
          limit: limit,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// PUT: Update class schedule date
export const updateClassScheduleDate = (
  classScheduleId: string,
  newDate: string,
) => {
  return axiosInstance.put(
    `/class-schedule/update/${classScheduleId}`,
    newDate,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

// GET: Personal schedule for a given month and year
export const getPersonalClassSchedule = (month: number, year: number) => {
  return axiosInstance.get<{
    message: string;
    statusCode: string;
    data: ClassSchedule[];
  }>(`/class-schedule/list/personal`, { params: { month, year } });
};

// GET: Class schedule for a given class, month and year
export const getClassSchedule2 = (
  classId: string,
  month: number,
  year: number,
) => {
  return axiosInstance.get<{
    message: string;
    statusCode: string;
    data: ClassSchedule[];
  }>(`/class-schedule/list/class/${classId}`, { params: { month, year } });
};

// GET: Paginated list of class schedule (past and future)
export const getPaginatedClassSchedule = (
  classId: string,
  page: number,
  limit: number,
  sortBy: string = "ASC",
) => {
  return axiosInstance.get(`/class-schedule/get-class-schedule/${classId}`, {
    params: { page, limit, sortBy },
  });
};

// GET: Count past lessons of a class
export const countPastLessons = (classId: string) => {
  return axiosInstance.get<{
    message: string;
    statusCode: string;
    data: { totalLessons: number; pastLessons: number };
  }>(`/class-schedule/count-past-lessons/${classId}`);
};
