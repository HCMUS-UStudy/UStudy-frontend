import axiosInstance from "@/app/lib/axios";
import { Session } from "@/app/types/type";

type BranchUpdate = {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
};

type BranchRequest = {
  name: string;
  address: string;
  contactNumber: string;
  rooms: string;
  sessions: Session[];
};

export const getAllBranches = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get("/branch/list", {
      params: {
        page: page,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
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
  const response = await axiosInstance.get(`/user/list-clerks`);
  return response.data;
};

export const updateBranch = async (branch: BranchUpdate) => {
  const response = await axiosInstance.patch(`/branch/update/${branch.id}`, {
    name: branch.name,
    address: branch.address,
    contactNumber: branch.contactNumber,
  });
  return response.data;
};

export const updateSessions = async (branchId: string, sessions: string[]) => {
  const response = await axiosInstance.patch(
    `/branch/update-sessions/${branchId}`,
    {
      sessions: sessions,
    },
  );
  return response.data;
};

export const updateAdmins = async (branchId: string, clerkIds: string[]) => {
  console.log(clerkIds);
  const response = await axiosInstance.patch(
    `/branch/update-admins/${branchId}`,
    {
      clerkIds: clerkIds,
    },
  );
  return response.data;
};
