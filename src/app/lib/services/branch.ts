import axiosInstance from "@/app/lib/axios";
import { Branch } from "@/app/types/type";

export const getAllBranches = async (page: number, limit: number) => {
  const response = await axiosInstance.get("/branch/clerk/get-all", {
    params: {
      page: page,
      limit: limit,
    },
  });
  return response.data;
};

export const addBranch = async (branch: Branch) => {
  const response = await axiosInstance.post("/branch/admin/add", branch);
  return response.data;
};
