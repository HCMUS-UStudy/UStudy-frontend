import axiosInstance from "@/app/lib/axios";
import { AttendaceData } from "@/app/types";

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
  console.log("recordAttendances", studentStatusList);
  try {
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
