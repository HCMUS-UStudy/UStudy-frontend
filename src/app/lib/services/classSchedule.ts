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
