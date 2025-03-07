import axiosInstance from "@/app/lib/axios";

export const getMaterialsByClassId = async (
  query: string,
  currentPage: number,
  classId: string,
) => {
  const response = await axiosInstance.get(`/class-material/view/${classId}`, {
    params: {
      page: currentPage,
      limit: 100,
      filter: query,
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
