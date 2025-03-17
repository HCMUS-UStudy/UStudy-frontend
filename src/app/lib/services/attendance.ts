import axiosInstance from "@/app/lib/axios";
import { AttendaceData } from "@/app/types/type";

export const getAllAttendances = async (
  classId: string,
  currentPage: number,
  limit: number,
  classScheduleId: string,
  status: string,
): Promise<AttendaceData> => {
  const response = await axiosInstance.get(`/attendance/list/${classId}`, {
    params: {
      page: currentPage,
      limit: limit,
      classScheduleId: classScheduleId,
      status: status,
    },
  });
  return response.data.data;
};
