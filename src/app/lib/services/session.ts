import axiosInstance from "@/app/lib/axios";
import { ClassSessionItem, Session, SessionItem } from "@/app/types";
import { CreateSessionInputs } from "@/app/ui/components/admin/branches/SessionModal";

export const getSession = async (filter?: string): Promise<Session[]> => {
  try {
    const response = await axiosInstance.get("/session/list", {
      params: {
        filter,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createSession = async (
  session: CreateSessionInputs,
): Promise<Session> => {
  try {
    const response = await axiosInstance.post("/session/create", session);
    return response.data.data;
  } catch (error) {
    throw error;
  }
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
    const response = await axiosInstance.post("/class-session/list-available", {
      branchId,
      gradeId,
      courseId,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
