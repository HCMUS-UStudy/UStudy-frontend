import axiosInstance from "@/app/lib/axios";
import { ClassScheduleItem } from "@/app/types";

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
