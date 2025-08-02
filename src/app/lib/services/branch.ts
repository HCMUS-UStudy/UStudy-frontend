import axiosInstance from "@/app/lib/axios";
import {
  BasePaginationResponse,
  Branch,
  BranchData,
  BranchItem,
  UserSummary,
  UserSummaryWithRole,
} from "@/app/types";
import { CreateBranchInputs } from "@/app/ui/components/admin/branches/AddBranchModal";
import { getUserId } from "../action";

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

export const getListClerk = async (
  branchId: string,
): Promise<BasePaginationResponse<UserSummaryWithRole>> => {
  try {
    const response = await axiosInstance.get(
      `/branch/list-admins/${branchId}`,
      {
        params: {
          page: 0,
          limit: 100,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableClerks = async () => {
  const response = await axiosInstance.get(`/user/list-clerks`);
  return response.data;
};

export const getAvailableClerksByBranchId = async (
  branchId: string,
): Promise<UserSummary[]> => {
  try {
    const response = await axiosInstance.get(`/user/list-clerks/${branchId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateBranch = async (branch: BranchUpdate) => {
  const response = await axiosInstance.patch(`/branch/update/${branch.id}`, {
    name: branch.name,
    address: branch.address,
    contactNumber: branch.contactNumber,
  });
  return response.data;
};

export const updateSessions = async (
  branchId: string,
  sessions: string[],
): Promise<Branch> => {
  try {
    const response = await axiosInstance.patch(
      `/branch/update-sessions/${branchId}`,
      {
        sessions: sessions,
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdmins = async (
  branchId: string,
  clerkIds: string[],
): Promise<UserSummaryWithRole[]> => {
  try {
    const userId = await getUserId();
    console.log(userId);
    if (userId === "") {
      throw new Error("Không tìm thấy UserId");
    }
    const ids = [...clerkIds, userId];
    const response = await axiosInstance.patch(
      `/branch/update-admins/${branchId}`,
      {
        clerkIds: ids,
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBranches = async () => {
  const response = await axiosInstance.get(`/branch/user-branches`, {
    params: {
      page: 0,
      limit: 100,
    },
  });

  return response.data.data;
};

export const getBranchById = async (branchId: string): Promise<BranchItem> => {
  try {
    const response = await axiosInstance.get(`/branch/details/${branchId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
