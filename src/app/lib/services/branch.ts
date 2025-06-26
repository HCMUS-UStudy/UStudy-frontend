import axiosInstance from "@/app/lib/axios";
import { Branch, BranchData } from "@/app/types";
import { CreateBranchInputs } from "@/app/ui/components/admin/branches/AddBranchModal";

type BranchUpdate = {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
};

export const getAllBranches = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<BranchData> => {
  try {
    const response = await axiosInstance.get("/branch/list", {
      params: {
        page: page,
        limit: limit,
        filter,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addBranch = async (
  branch: CreateBranchInputs,
): Promise<Branch> => {
  try {
    const response = await axiosInstance.post("/branch/create", branch);
    return response.data;
  } catch (error) {
    throw error;
  }
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
  const response = await axiosInstance.patch(
    `/branch/update-admins/${branchId}`,
    {
      clerkIds: clerkIds,
    },
  );
  return response.data;
};

export const getUserBranches = async () => {
  const response = await axiosInstance.get(`/branch/user-branches`, {
    params: {
      page: 0,
      limit: 100,
    },
  });

  return response.data;
};
