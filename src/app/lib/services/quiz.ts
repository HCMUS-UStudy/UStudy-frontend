import axiosInstance from "@/app/lib/axios";
import { QnA, QuizData } from "@/app/types";

export const getQuizByClassId = async (
  currentPage: number,
  limit: number,
  classId: string,
): Promise<QuizData> => {
  try {
    const response = await axiosInstance.get(`/quiz/list`, {
      params: {
        page: currentPage,
        limit: limit,
        classId: classId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getDetailQuiz = async (quizId: string): Promise<QnA> => {
  try {
    const response = await axiosInstance.get(`/quiz/details/${quizId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getReviewQuiz = async (quizId: string) => {
  const response = await axiosInstance.get(`/quiz/details/review/${quizId}`);
  return response.data.data;
};

export const submitQuiz = async (body: {
  quizId: string;
  duration: number;
  answers: {
    questionId: string;
    optionId: string;
  }[];
}) => {
  const response = await axiosInstance.post(`/quiz/submit`, body);
  return response.data;
};
