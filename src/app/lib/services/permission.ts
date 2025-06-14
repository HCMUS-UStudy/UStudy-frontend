import axiosInstance from "../axios";

export const getPermissions = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get("/permission/screens");
    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
