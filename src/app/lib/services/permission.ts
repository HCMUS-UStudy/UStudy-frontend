import axiosInstance from "../axios";

export const getPermissions = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get("/permission/screens");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
