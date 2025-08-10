import { AIAssignment } from "@/app/types";
import axiosInstance from "../axios";

export const getAIAssignment = async (
  questionId: string,
): Promise<AIAssignment> => {
  try {
    const response = await axiosInstance.post(`/ai/questions/${questionId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getScoringCriteria = async (
  grade: string,
  course: string,
  question: string,
) => {
  try {
    const response = await axiosInstance.post(`/ai/scoring-criteria`, {
      course: course,
      grade: grade,
      question: question,
      maxTokens: 1000,
      temperature: 0.7,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
