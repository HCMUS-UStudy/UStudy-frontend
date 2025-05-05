import axiosInstance from "@/app/lib/axios";

export const createQuestion = async (body: {
  description: string;
  gradeId: string;
  courseId: string;
  questionType: string;
  options: Array<{
    description: string;
    isCorrect: boolean;
  }>;
}) => {
  const response = await axiosInstance.post("/question/create", body);
  return response.data.data;
};

export const getQnAListByAssignmentId = async (
  currentPage: number,
  limit: number,
  assignmentId: string,
) => {
  const response = await axiosInstance.get(`/question/list/${assignmentId}`, {
    params: {
      page: currentPage,
      limit: limit,
    },
  });
  return response.data.data;
};

export const handleDownloadFile = async (questionId: string) => {
  const response = await axiosInstance.get(`/question/download/${questionId}`, {
    responseType: "blob", // Quan trọng để xử lý file
  });
  return response;
};
