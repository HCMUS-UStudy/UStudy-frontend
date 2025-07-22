import axiosInstance from "@/app/lib/axios";
import {
  AttendaceData,
  AttendanceListByStudentResponse,
  AttendanceListByStudentParams,
} from "@/app/types";

export const getAttendances = async (
  currentPage: number,
  limit: number,
  classScheduleId: string,
  status?: string,
): Promise<AttendaceData> => {
  const response = await axiosInstance.get(
    `/attendance/list/${classScheduleId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
        status: status,
      },
    },
  );
  return response.data.data;
};

export const recordAttendances = async (
  classId: string,
  recordDate: string,
  studentStatusList: {
    userId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "";
    note: string;
  }[],
): Promise<void> => {
  try {
    console.log("Recording attendance:", {
      classId,
      recordDate,
      studentStatusList,
    });
    const response = await axiosInstance.post("/attendance/record", {
      classId,
      recordDate,
      studentStatusList,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendanceListByStudent = async (
  params: AttendanceListByStudentParams,
): Promise<AttendanceListByStudentResponse> => {
  const response = await axiosInstance.get("/attendance/list-by-student", {
    params: {
      classId: params.classId,
      month: params.month,
      year: params.year,
      ...(params.studentId && { studentId: params.studentId }),
    },
  });
  return response.data;
};
