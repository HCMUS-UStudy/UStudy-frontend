import axiosInstance from "@/app/lib/axios";
import { Branch } from "@/app/types";

export const getAllRoles = async () => {
  const response = await axiosInstance.get("/role/list", {});
  return response.data;
};

export const getAllRolesByDefault = async (defaultRole: string) => {
  const response = await axiosInstance.get("/role/default-route", {
    params: {
      defaultRoute: defaultRole,
    },
  });
  return response.data.data;
};

export const addRole = async (branch: Branch) => {
  const response = await axiosInstance.post("/role/create", branch);
  return response.data;
};
