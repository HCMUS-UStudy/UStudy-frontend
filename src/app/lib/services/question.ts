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
  scoringCriteria: string;
}) => {
  const formData = new FormData();
  formData.append("description", body.description);
  formData.append("gradeId", body.gradeId);
  formData.append("courseId", body.courseId);
  formData.append("questionType", body.questionType);
  formData.append("scoringCriteria", body.scoringCriteria || "");

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

export const getQuestionDetail = async (questionId: string) => {
  const response = await axiosInstance.get(`/question/details/${questionId}`);
  return response.data.data;
};

export const editQuestion = async (
  questionId: string,
  description: string,
  file?: File | null,
  gradeId?: string,
  courseId?: string,
  questionType?: string,
  options?: {
    id: string;
    description: string;
    isCorrect: boolean;
  }[],
  scoringCriteria?: string,
  isDeleteFile?: boolean,
) => {
  const formData = new FormData();
  formData.append("description", description);
  if (gradeId) formData.append("gradeId", gradeId);
  if (courseId) formData.append("courseId", courseId);
  if (questionType) formData.append("questionType", questionType);
  formData.append("scoringCriteria", scoringCriteria || "");
  formData.append("isDeleteFile", String(isDeleteFile));

  if (file) {
    formData.append("file", file);
  }

  if (options) {
    options.forEach((option, index) => {
      formData.append(`options[${index}].id`, option.id);
      formData.append(`options[${index}].description`, option.description);
      formData.append(`options[${index}].isCorrect`, String(option.isCorrect));
    });
  }

  const response = await axiosInstance.patch(
    `/question/update/${questionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};
