import axiosInstance from "@/app/lib/axios";

export const createQuestion = async (body: {
  description: string;
  file?: File | null;
  gradeId: string;
  courseId: string;
  questionType: string;
  options?: {
    description: string;
    isCorrect: boolean;
  }[];
}) => {
  const formData = new FormData();
  formData.append("description", body.description);
  formData.append("gradeId", body.gradeId);
  formData.append("courseId", body.courseId);
  formData.append("questionType", body.questionType);

  if (body.file) {
    formData.append("file", body.file);
  }

  if (body.options) {
    body.options.forEach((option, index) => {
      formData.append(`options[${index}].description`, option.description);
      formData.append(`options[${index}].isCorrect`, String(option.isCorrect));
    });
  }

  const response = await axiosInstance.post("/question/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const getQuestionList = async (
  courseId?: string,
  gradeId?: string,
  createdBy?: string,
) => {
  const response = await axiosInstance.get("/question/list", {
    params: {
      page: 0,
      limit: 100,
      courseId: courseId,
      gradeId: gradeId,
      createdBy: createdBy,
    },
  });
  console.log("response", response.data);
  return response.data.data.content;
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
