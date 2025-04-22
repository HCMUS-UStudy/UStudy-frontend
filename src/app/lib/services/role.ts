import axiosInstance from "@/app/lib/axios";
import { Branch, DefaultRoute, RoleItem } from "@/app/types";

export const getAllRoles = async () => {
  const response = await axiosInstance.get("/role/list", {});
  return response.data;
};

export const getAllRolesByDefault = async (
  defaultRole: DefaultRoute,
): Promise<RoleItem[]> => {
  try {
    const response = await axiosInstance.get("/role/default-route", {
      params: {
        defaultRoute: defaultRole,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addRole = async (branch: Branch) => {
  const response = await axiosInstance.post("/role/create", branch);
  return response.data;
};
