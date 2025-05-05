import axiosInstance from "@/app/lib/axios";

export const getAssignmentByClassId = async (
  currentPage: number,
  limit: number,
  classId: string,
) => {
  const response = await axiosInstance.get(`/assignment/list/${classId}`, {
    params: {
      page: currentPage,
      limit: limit,
    },
  });
  return response.data.data;
};

export const getDetailAssignment = async (assignmentId: string) => {
  const response = await axiosInstance.get(
    `/assignment/details/${assignmentId}`,
  );
  return response.data.data;
};
