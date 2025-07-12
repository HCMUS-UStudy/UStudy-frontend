import axiosInstance from "@/app/lib/axios";
export const registAvailableTime = async (
  userId: string,
  dayTimes: {
    day: string; // "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
    startTime: string; // "07:00",
    endTime: string; // "17:00"
  }[],
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
