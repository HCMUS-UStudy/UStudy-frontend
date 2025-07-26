import { DashboardData } from "@/app/types";
import axiosInstance from "../axios";

export const getAdminDashboardData = async (
  branchId: string,
): Promise<DashboardData> => {
  try {
    const response = await axiosInstance.get(`/dashboard/overview/${branchId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
