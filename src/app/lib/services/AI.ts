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
