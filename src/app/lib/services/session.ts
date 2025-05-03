import axiosInstance from "@/app/lib/axios";
import {
  ClassSessionItem,
  Session,
  SessionData,
  SessionItem,
  SessionResponse,
} from "@/app/types";
import { CreateSessionInputs } from "@/app/ui/components/admin/branches/SessionModal";

export const getSession = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<SessionData> => {
  try {
    const response = await axiosInstance.get("/session/list", {
      params: {
        page,
        limit,
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

export const deleteSession = async (
  sessionId: string,
): Promise<SessionResponse> => {
  try {
    const response = await axiosInstance.delete(`/session/delete/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSession = async (
  session: Session,
): Promise<SessionResponse> => {
  try {
    const response = await axiosInstance.put(`/session/update/${session.id}`, {
      name: session.name,
      startTime: session.startTime,
      endTime: session.endTime,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
