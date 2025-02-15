import axiosInstance from "@/app/lib/axios";

export const getListChapter = async (
  courseId: string,
  gradeId: string,
  page: number,
  limit: number,
  filter: string = "",
) => {
  const response = await axiosInstance.get("/chapter/list-chapter", {
    params: {
      courseId,
      gradeId,
      page,
      limit,
      filter,
    },
  });
  return response.data.data;
};

export const getChapterByCourse_GradeId = async (
  query: string,
  currentPage: number,
  courseId: string,
  gradeId: string,
) => {
  const response = await axiosInstance.get("/chapter/list-chapter", {
    params: {
      page: currentPage,
      limit: 5,
      filter: query,
      courseId: courseId,
      gradeId: gradeId,
    },
  });
  return response.data.data;
};

export const getChapterById = async (chapterId: string) => {
  const response = await axiosInstance.get(`/chapter/details`, {
    params: {
      id: chapterId,
    },
  });
  return response.data.data;
};
