import axiosInstance from "@/app/lib/axios";
import { AssignmentCount, AssignmentMode } from "@/app/types/assignment";

export const getAssignmentCount = async (
  mode?: AssignmentMode,
): Promise<AssignmentCount> => {
  try {
    const response = await axiosInstance.get("/assignment/count", {
      params: {
        mode,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

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

export const handleDownloadFile = async (assignmentId: string) => {
  const response = await axiosInstance.get(
    `/assignment/download/${assignmentId}`,
    {
      responseType: "blob", // Quan trọng để xử lý file
    },
  );
  return response;
};

export const createAssignment = async (body: {
  classId: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  numAttempts: number;
  existingQuestions: string[];
}) => {
  const formData = new FormData();
  formData.append("classId", body.classId);
  formData.append("title", body.title);
  formData.append("startTime", body.startTime);
  formData.append("endTime", body.endTime);
  formData.append("duration", body.duration.toString());
  formData.append("numAttempts", body.numAttempts.toString());
  body.existingQuestions.forEach((questionId) => {
    formData.append("existingQuestions", questionId);
  });

  const response = await axiosInstance.post("/assignment/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};
