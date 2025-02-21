import axiosInstance from "@/app/lib/axios";

export const getAllGrades = async () => {
  const response = await axiosInstance.get("/grade/list", {
    params: {
      page: 0,
      limit: 15,
      filter: "",
    },
  });
  return response;
};

export const getGradesByCourseId = async (
  query: string,
  currentPage: number,
  courseId: string,
) => {
  const response = await axiosInstance.get(`/grade/list/${courseId}`, {
    params: {
      page: currentPage,
      limit: 15,
      filter: query,
    },
  });
  return response.data.data;
};

export const getGradeById = async (gradeId: string) => {
  const response = await axiosInstance.get(`/grade/details/${gradeId}`);
  return response.data.data;
};
