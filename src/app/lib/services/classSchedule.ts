import axiosInstance from "@/app/lib/axios";
import { ClassSchedule, ClassScheduleItem, BranchSchedule } from "@/app/types";

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
) => {
  const response = await axiosInstance.get(
    `/class-schedule/get-class-schedule/${classId}`,
    {
      params: {
        page: page,
        limit: limit,
      },
    },
  );
  return response.data.data.content;
};

export const getPastSchedule = async (
  classId: string,
  page: number,
  limit: number,
) => {
  const response = await axiosInstance.get(
    `/class-schedule/list-past-schedule/${classId}`,
    {
      params: {
        page: page,
        limit: limit,
      },
    },
  );
  return response.data.data.content;
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
export const getPersonalClassSchedule = (
  month: number,
  year: number,
  studentId?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = { month, year };
  if (studentId) params.studentId = studentId;
  return axiosInstance.get<{
    message: string;
    statusCode: string;
    data: ClassSchedule[];
  }>(`/class-schedule/list/personal`, { params });
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

// GET: Branch schedule - Get schedule of all classes of a branch in a month of year
export const getBranchSchedule = (
  branchId: string,
  month: number,
  year: number,
) => {
  return axiosInstance.get<{
    message: string;
    statusCode: string;
    data: BranchSchedule[];
  }>(`/class-schedule/list/branch/${branchId}`, {
    params: { month, year },
  });
};

export const getClassScheduleForTeacher = async (
  month: number,
  year: number,
) => {
  try {
    const response = await axiosInstance.get("/class-schedule/list/personal", {
      params: {
        month,
        year,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
