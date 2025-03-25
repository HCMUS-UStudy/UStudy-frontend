import axiosInstance from "@/app/lib/axios";
import {
  SubmissionItem,
  SubmissionSchema,
  UpdateSubmissionSchema,
} from "@/app/types/type";

export const createNewSubmission = async (
  assignmentId: string,
  data: SubmissionSchema,
) => {
  const formData = new FormData();
  formData.append("content", data.content);

  data.files.forEach((file) => {
    formData.append("files", file); // BE nhận danh sách files[]
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

export const getSubmissionDetails = async (assignmentId: string) => {
  const response = await axiosInstance.get(
    `/submission/details/review/${assignmentId}`,
  );

  return response.data.data as SubmissionItem;
};

export const updateSubmission = async (
  submissionId: string,
  assignmentId: string,
  data: UpdateSubmissionSchema,
) => {
  const formData = new FormData();
  formData.append("content", data.content);

  data.addedFiles.forEach((file) => {
    formData.append("addedFiles", file);
  });

  data.deletedFiles.forEach((file) => {
    formData.append("deletedFiles", file);
  });

  try {
    const response = await axiosInstance.patch(
      `/submission/update/${submissionId}?assignmentId=${assignmentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
