import axiosInstance from "@/app/lib/axios";
import { ClassMaterialItem } from "@/app/types";

export const getListMaterial = async (
  classId: string,
  folderId: string | null,
) => {
  const response = await axiosInstance.get(`/class-material/list/${classId}`, {
    params: {
      folderId: folderId,
      page: 0,
      limit: 100,
      filter: "",
    },
    id: !folderId
      ? `getListMaterial_${classId}`
      : `getListMaterial_${classId}_${folderId}`,
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

export const createFolder = async (
  classId: string,
  name: string,
  parentId: string | null,
) => {
  const response = await axiosInstance.post(
    `/class-material/create-folder/${classId}`,
    {
      name: name,
      parentId: parentId,
    },
    {
      cache: {
        update: {
          [parentId
            ? `getListMaterial_${classId}_${parentId}`
            : `getListMaterial_${classId}`]: (
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
  console.log("response", response.data);
  return response.data;
};

export const uploadMaterial = async (
  classId: string,
  data: FormData,
  parentId: string | null,
) => {
  const response = await axiosInstance.post(
    `/class-material/upload-file/${classId}`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
      cache: {
        update: {
          [parentId
            ? `getListMaterial_${classId}_${parentId}`
            : `getListMaterial_${classId}`]: (
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
  classId: string,
  parentId: string | null,
  materialId: string,
) => {
  const response = await axiosInstance.delete(
    `/class-material/delete/${classId}/${materialId}`,
    {
      cache: {
        update: {
          [parentId
            ? `getListMaterial_${classId}_${parentId}`
            : `getListMaterial_${classId}`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content =
              cached.data.data.data.content.filter(
                (material: ClassMaterialItem) => material.id !== materialId,
              );
            return cached;
          },
        },
      },
    },
  );
  return response.data;
};
