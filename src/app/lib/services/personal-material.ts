import axiosInstance from "@/app/lib/axios";
import { MaterialData } from "@/app/types";

export const getMaterial = async (): Promise<MaterialData> => {
  const response = await axiosInstance.get(`/material/personal/list`, {
    params: {
      page: 0,
      limit: 100,
    },
  });
  return response.data.data;
};

export const getPersonalMaterial = async (
  materialId: string,
): Promise<Blob> => {
  const response = await axiosInstance.get(`/material/preview/${materialId}`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadPersonalMaterial = async (materialId: string) => {
  const response = await axiosInstance.get(
    `/material/download/personal/${materialId}`,
    { responseType: "blob" },
  );
  return response.data;
};
