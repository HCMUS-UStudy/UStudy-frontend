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
