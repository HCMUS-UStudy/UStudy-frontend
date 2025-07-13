import axiosInstance from "@/app/lib/axios";
import { SubmissionData, SubmissionDetail } from "@/app/types";

// export const createNewSubmission = async (
//   assignmentId: string,
//   data: SubmissionSchema,
// ) => {
//   const formData = new FormData();
//   formData.append("content", data.content);

//   data.files.forEach((file) => {
//     formData.append("files", file); // BE nhận danh sách files[]
//   });

//   const response = await axiosInstance.post(
//     `/submission/create/${assignmentId}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     },
//   );

//   return response.data;
// };

export const createNewSubmission = async (
  assignmentId: string,
  body: {
    duration: number;
    answers: {
      content: string;
      files: File[];
      questionId: string;
      optionId: string;
    }[];
  },
) => {
  const formData = new FormData();
  formData.append("duration", body.duration.toString());

  body.answers.forEach((answer, index) => {
    formData.append(`answers[${index}].questionId`, answer.questionId);
    formData.append(`answers[${index}].optionId`, answer.optionId);
    formData.append(`answers[${index}].content`, answer.content);

    // Nếu không có file, vẫn nên gửi rỗng
    if (answer.files.length === 0) {
      formData.append(
        `answers[${index}].files`,
        new Blob([], { type: "application/octet-stream" }),
      );
    } else {
      answer.files.forEach((file) => {
        formData.append(`answers[${index}].files`, file);
      });
    }
  });

  const response = await axiosInstance.post(
    `/submission/create/${assignmentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getSubmissionDetails = async (
  submissionId: string,
  showDetails: boolean,
) => {
  const response = await axiosInstance.get(
    `/submission/details/${submissionId}`,
    {
      params: {
        showDetails: showDetails,
      },
    },
  );

  return response.data.data as SubmissionDetail;
};

export const getSubmissionByAssignmentId = async (
  assignmentId: string,
  currentPage: number,
  limit: number,
): Promise<SubmissionData> => {
  try {
    const response = await axiosInstance.get(
      `/submission/list/${assignmentId}`,
      {
        params: {
          page: currentPage,
          limit: limit,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubmission = async (
  submissionId: string,
  data: {
    answers: {
      questionId: string;
      content: string;
      addedFiles: File[]; // Array of strings for file IDs or URLs
      deletedFiles: string[]; // Array of strings for file IDs or URLs
    }[];
  },
) => {
  const formData = new FormData();

  // Loop over each answer to append the necessary fields to FormData
  data.answers.forEach((answer, index) => {
    // Append questionId and content for each answer using dot notation
    formData.append(`answers[${index}].questionId`, answer.questionId);
    formData.append(`answers[${index}].content`, answer.content);

    // Append addedFiles as strings (file IDs or URLs)
    answer.addedFiles.forEach((fileId, fileIndex) => {
      formData.append(`answers[${index}].addedFiles[${fileIndex}]`, fileId);
    });

    // Append deletedFiles as strings (file IDs or URLs)
    answer.deletedFiles.forEach((fileId, fileIndex) => {
      formData.append(`answers[${index}].deletedFiles[${fileIndex}]`, fileId);
    });
  });

  // Log the FormData content for debugging
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    // Send the request with the FormData
    const response = await axiosInstance.patch(
      `/submission/update/${submissionId}`,
      formData, // Send the FormData
      {
        headers: {
          "Content-Type": "multipart/form-data", // The browser sets the correct content type for multipart/form-data
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
};

export const deleteSubmission = async (submissionId: string) => {
  const response = await axiosInstance.delete(
    `/submission/delete/${submissionId}`,
  );

  return response.data;
};

export const gradeSubmission = async (
  submissionId: string,
  feedback: string,
  questions: {
    questionId: string;
    feedback: string;
    score: number;
  }[],
) => {
  const response = await axiosInstance.patch(
    `/submission/grade/${submissionId}`,
    {
      feedback: feedback,
      questions: questions,
    },
  );

  return response.data.data;
};

export const AIGradeSubmission = async (submissionId: string) => {
  const response = await axiosInstance.post(
    `/submission/ai/grade/${submissionId}`,
  );

  return response.data.data;
};
