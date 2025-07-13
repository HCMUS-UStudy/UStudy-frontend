import axiosInstance from "@/app/lib/axios";

export const getAvailableTime = async (
  userId?: string,
): Promise<{
  lastModified: string;
  timeList: {
    day: string; // "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
    startTime: string; // "07:00",
    endTime: string; // "17:00"
  }[];
}> => {
  try {
    const response = await axiosInstance.get("/available-time/list", {
      params: {
        userId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const registAvailableTime = async (
  dayTimes: {
    day: string; // "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
    startTime: string; // "07:00",
    endTime: string; // "17:00"
  }[],
  userId?: string,
): Promise<void> => {
  try {
    const response = await axiosInstance.post("/available-time/register", {
      userId,
      dayTimes,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
