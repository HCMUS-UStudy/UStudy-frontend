import axiosInstance from "@/app/lib/axios";

export const getListChildClasses = async (
  childId: string,
  page: number,
  limit: number,
  filter: string = "",
) => {
  const response = await axiosInstance.get(`/parent/child-classes/${childId}`, {
    params: {
      page,
      limit,
      filter,
    },
  });
  return response.data.data;
};
