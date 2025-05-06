import axiosInstance from "@/app/lib/axios";
import { PersonalMaterialItem } from "@/app/types";

export const getListMaterial = async (folderId: string | null) => {
  const response = await axiosInstance.get(`/personal-material/list`, {
    params: {
      folderId: folderId,
      page: 0,
      limit: 100,
      filter: "",
    },
    id: !folderId ? `getListMaterial` : `getListMaterial_${folderId}`,
  });
  return response.data.data;
};

export const getPreview = async (materialId: string) => {
  const response = await axiosInstance.get(`/material/preview/${materialId}`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadMaterial = async (materialId: string) => {
  const response = await axiosInstance.get(
    `/personal-material/download/${materialId}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const createFolder = async (name: string, parentId: string | null) => {
  const response = await axiosInstance.post(
    `/personal-material/create-folder`,
    {
      name: name,
      parentId: parentId,
    },
    {
      cache: {
        update: {
          [parentId ? `getListMaterial_${parentId}` : `getListMaterial`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
            response,
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content.push(response.data.data);
            return cached;
          },
        },
      },
    },
  );
  return response.data;
};

export const uploadMaterial = async (
  data: FormData,
  parentId: string | null,
) => {
  const response = await axiosInstance.post(
    `/personal-material/upload-file`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
      cache: {
        update: {
          [parentId ? `getListMaterial_${parentId}` : `getListMaterial`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
            response,
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content.push(response.data.data);
            return cached;
          },
        },
      },
    },
  );
  return response.data;
};

export const deleteMaterial = async (
  parentId: string | null,
  materialId: string,
) => {
  const response = await axiosInstance.delete(
    `/personal-material/delete/${materialId}`,
    {
      cache: {
        update: {
          [parentId ? `getListMaterial_${parentId}` : `getListMaterial`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content =
              cached.data.data.data.content.filter(
                (material: PersonalMaterialItem) => material.id !== materialId,
              );
            return cached;
          },
        },
      },
    },
  );
  return response.data;
};
