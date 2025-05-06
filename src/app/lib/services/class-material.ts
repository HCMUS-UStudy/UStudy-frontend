import axiosInstance from "@/app/lib/axios";

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
  );
  console.log("response", response.data);
  return response.data;
};

export const uploadMaterial = async (classId: string, data: FormData) => {
  const response = await axiosInstance.post(
    `/class-material/upload-file/${classId}`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
    },
  );
  return response.data;
};

export const deleteMaterial = async (classId: string, materialId: string) => {
  const response = await axiosInstance.delete(
    `/class-material/delete/${classId}/${materialId}`,
  );
  return response.data;
};
