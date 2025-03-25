import axiosInstance from "@/app/lib/axios";
import { AttendaceData } from "@/app/types/type";

export const getAllAttendancesNoStatus = async (
  currentPage: number,
  limit: number,
  classScheduleId: string,
): Promise<AttendaceData> => {
  const response = await axiosInstance.get(
    `/attendance/list/${classScheduleId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
        classScheduleId: classScheduleId,
      },
    },
  );
  return response.data.data;
};

export const getAllAttendances = async (
  currentPage: number,
  limit: number,
  classScheduleId: string,
  status: string,
): Promise<AttendaceData> => {
  const response = await axiosInstance.get(
    `/attendance/list/${classScheduleId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
        classScheduleId: classScheduleId,
        status: status,
      },
    },
  );
  return response.data.data;
};

export const recordAttendances = async (
  classScheduleId: string,
  studentStatusList: {
    userId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "";
  }[],
): Promise<void> => {
  try {
    const response = await axiosInstance.post("/attendance/record", {
      classScheduleId,
      studentStatusList,
    });
    console.log("Attendance recorded successfully:", response.data);
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
};
