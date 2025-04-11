import axiosInstance from "@/app/lib/axios";
import { ClassSessionItem, SessionItem } from "@/app/types";

type SessionRequest = {
  name: string;
  startTime: string;
  endTime: string;
};

export const getSession = async (page: number, limit: number) => {
  const response = await axiosInstance.get("/session/list", {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

export const createSession = async (session: SessionRequest) => {
  const response = await axiosInstance.post("/session/create", session);
  return response.data;
};

export const getSessionByBranchId = async (
  branchId: string,
): Promise<SessionItem[]> => {
  try {
    const response = await axiosInstance.get(`/session/list/${branchId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getClassSession = async (
  branchId: string,
  gradeId: string,
  courseId: string,
): Promise<ClassSessionItem[]> => {
  try {
    const response = await axiosInstance.post(
      "/class-session/list-available",
      {
        branchId,
        gradeId,
        courseId,
      },
      {
        cache: {
          methods: ["post"],
        },
      },
    );
    console.log(response.cached);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
