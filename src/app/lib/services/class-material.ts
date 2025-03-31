import axiosInstance from "@/app/lib/axios";
import { MaterialData, MaterialItem } from "@/app/types/type";

// type CachedDataData = {
//   data: MaterialData;
//   messsage: string;
//   statusCode: string;
// };

// type CachedData = {
//   data: CachedDataData;
//   status: number;
// };

// type Cached = {
//   data: CachedData;
//   state: string;
//   createdAt: number;
// };

export const getMaterialsByClassId = async (
  filter: string,
  currentPage: number,
  classId: string,
): Promise<MaterialData> => {
  const response = await axiosInstance.get(`/class-material/view/${classId}`, {
    params: {
      page: currentPage,
      limit: 100,
      filter: filter,
    },
    id: `getMaterialsByClassId_${classId}`,
  });
  return response.data.data;
};

export const getMaterialsByParent = async (
  currentPage: number,
  limit: number,
  classId: string,
  materialId: string,
): Promise<MaterialData> => {
  const response = await axiosInstance.get(
    `/class-material/view/${classId}/${materialId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
      },
      id: `getMaterialsByParent_${classId}_${materialId}`,
    },
  );
  return response.data.data;
};

export const downloadPersonalMaterial = async (materialId: string) => {
  const response = await axiosInstance.get(
    `/material/download/personal/${materialId}`,
    { responseType: "blob" },
  );
  return response.data;
};

export const downloadSystemMaterial = async (materialId: string) => {
  const response = await axiosInstance.get(
    `/material/download/system/${materialId}`,
    { responseType: "blob" },
  );
  return response.data;
};

export const uploadClassMaterial = async (
  data: FormData,
  parentId: string,
  classId: string,
) => {
  const response = await axiosInstance.post(
    `/class-material/upload/file/${classId}`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
      cache: {
        update: {
          [`getMaterialsByParent_${classId}_${parentId}`]: (
            cached: any,
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

export const createFolder = async (classId: string, name: string) => {
  const response = await axiosInstance.post(
    `/class-material/create/folder/${classId}`,
    { name: name },
    {
      cache: {
        update: {
          [`getMaterialsByClassId_${classId}`]: (cached: any, response) => {
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

export const deleteClassMaterial = async (
  classId: string,
  materialId: string,
  parentId: string,
) => {
  const response = await axiosInstance.delete(
    `/class-material/delete/${classId}/${materialId}`,
    {
      cache: {
        update: {
          [`getMaterialsByParent_${classId}_${parentId}`]: (cached: any) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content =
              cached.data.data.data.content.filter(
                (material: MaterialItem) => material.id !== materialId,
              );
            return cached;
          },
        },
      },
    },
  );
  return response.data;
};
