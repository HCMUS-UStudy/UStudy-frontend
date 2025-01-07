import axiosInstance from "@/app/lib/axios";

export const getAllGrades = async () => {
  const response = await axiosInstance.get("/grade/clerk/get-all", {
    params: {
      page: 0,
      limit: 10,
    },
  });
  return response.data.data.content;
};

export const getGradesByCourseId = async (
  query: string,
  currentPage: number,
  courseId: string,
) => {
  const response = await axiosInstance.get(
    "/grade/admin/get-grades-by-course",
    {
      params: {
        page: currentPage,
        limit: 5,
        filter: query,
        courseId: courseId,
      },
    },
  );
  return response.data.data;
};

export const getGradeById = async (gradeId: string) => {
  const response = await axiosInstance.get(`/grade/clerk/${gradeId}`);
  return response.data.data;
};
