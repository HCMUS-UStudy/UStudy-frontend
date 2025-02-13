import axiosInstance from "@/app/lib/axios";

export const getMaterialsByChapterId = async (
  query: string,
  currentPage: number,
  chapterId: string,
) => {
  const response = await axiosInstance.get(`/material/list/${chapterId}`, {
    params: {
      page: currentPage,
      limit: 5,
      filter: query,
    },
  });
  return response.data.data;
};
