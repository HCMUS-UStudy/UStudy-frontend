import axiosInstance from "@/app/lib/axios";

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

export const getSessionByBranchId = async (branchId: string) => {
  try {
    const response = await axiosInstance.get(`/session/list/${branchId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
