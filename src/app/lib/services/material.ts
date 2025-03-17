import axiosInstance from "@/app/lib/axios";

export const getMaterialsByClassId = async (
  filter: string,
  currentPage: number,
  classId: string,
) => {
  const response = await axiosInstance.get(`/class-material/view/${classId}`, {
    params: {
      page: currentPage,
      limit: 100,
      filter: filter,
    },
  });
  return response.data.data;
};

export const getMaterialsByParent = async (
  currentPage: number,
  limit: number,
  classId: string,
  materialId: string,
) => {
  const response = await axiosInstance.get(
    `/class-material/view/${classId}/${materialId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
      },
    },
  );
  return response.data.data;
};

export const getListSystemMaterial = async (
  currentPage: number,
  limit: number,
) => {
  const response = await axiosInstance.get("/material/system/list", {
    params: {
      page: currentPage,
      limit: limit,
    },
  });
  return response.data.data;
};

export const getSystemMaterialByParent = async (
  folderId: string,
  currentPage: number,
  limit: number,
  filter: string,
) => {
  const response = await axiosInstance.get("/material/system/list", {
    params: {
      folderId: folderId,
      page: currentPage,
      limit: limit,
      filter: filter,
    },
  });
  return response.data.data;
};
