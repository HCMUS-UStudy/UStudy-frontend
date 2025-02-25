import axiosInstance from "@/app/lib/axios";
import { Session } from "@/app/types/type";

type BranchRequest = {
  name: string;
  address: string;
  contactNumber: string;
  rooms: string;
  sessions: Session[];
};

export const getAllBranches = async (page: number, limit: number) => {
  const response = await axiosInstance.get("/branch/list", {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

export const addBranch = async (branch: BranchRequest) => {
  const response = await axiosInstance.post("/branch/create", {
    ...branch,
    sessions: branch.sessions
      .filter((session) => session.id !== "")
      .map((session) => session.id),
  });
  return response.data;
};

export const assignClerks = async (branchId: string, clerkIds: string[]) => {
  const response = await axiosInstance.post(
    `/branch/assign/${branchId}`,
    clerkIds,
  );
  return response.data;
};

export const getListClerk = async (branchId: string) => {
  const response = await axiosInstance.get(`/branch/list-admins/${branchId}`, {
    params: {
      page: 0,
      limit: 100,
    },
  });
  return response.data;
};

export const getAvailableClerks = async () => {
  const response = await axiosInstance.get(`/user/list-available-clerks`);
  return response.data;
};
