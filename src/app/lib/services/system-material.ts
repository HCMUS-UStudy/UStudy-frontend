import axiosInstance from "@/app/lib/axios";

export const getListMaterial = async (folderId: string | null) => {
  const response = await axiosInstance.get(`/system-material/list`, {
    params: {
      folderId: folderId,
      page: 0,
      limit: 100,
      filter: "",
    },
  });
  return response.data.data;
};

export const getListByCourseGrade = async (
  courseId: string,
  gradeId: string,
) => {
  const response = await axiosInstance.get(
    `/system-material/list-course-grade`,
    {
      params: {
        page: 0,
        limit: 100,
        courseId: courseId,
        gradeId: gradeId,
      },
    },
  );
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
    `/system-material/download/${materialId}`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const createFolder = async (
  name: string,
  parentId: string | null,
  courseId: string,
  gradeId: string,
) => {
  const response = await axiosInstance.post(`/system-material/create-folder`, {
    name: name,
    parentId: parentId,
    courseId: courseId,
    gradeId: gradeId,
  });
  return response.data;
};

export const uploadMaterial = async (data: FormData) => {
  const response = await axiosInstance.post(
    `/system-material/upload-file`,
    data,
    {
      headers: {
        "Content-Type": "form-data",
      },
    },
  );
  return response.data;
};

export const deleteMaterial = async (materialId: string) => {
  const response = await axiosInstance.delete(
    `/system-material/delete/${materialId}`,
  );
  return response.data;
};
