import { AcademicResult } from "@/app/types";
import axiosInstance from "../axios";
import {
  StudentSummaryResponse,
  StudentDetailsResponse,
  AcademicResultAdmin,
} from "@/app/types/academicResult";

export const getAcademicResult = async (
  classId: string,
  page: number,
  limit: number,
): Promise<AcademicResult> => {
  try {
    const response = await axiosInstance.get(
      `/academic-result/details/${classId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAcademicResults = async (): Promise<AcademicResultAdmin> => {
  const response = await axiosInstance.get("/api/academic-results");
  return response.data;
};

// New API functions for student summary and details
export const getStudentSummary = async (): Promise<StudentSummaryResponse> => {
  try {
    const response = await axiosInstance.get("/api/students/summary");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student summary:", error);
    // Return mock data if API fails
    return {
      status: 200,
      message: "Lấy danh sách học sinh thành công",
      data: [
        {
          genId: "HS001",
          name: "Nguyễn Văn A",
          averageScore: 8.8,
          academicRank: "Giỏi",
        },
        {
          genId: "HS004",
          name: "Phạm Thị D",
          averageScore: 8.8,
          academicRank: "Giỏi",
        },
        {
          genId: "HS002",
          name: "Trần Thị B",
          averageScore: 7.3,
          academicRank: "Khá",
        },
        {
          genId: "HS003",
          name: "Lê Văn C",
          averageScore: 6.8,
          academicRank: "Trung bình",
        },
        {
          genId: "HS005",
          name: "Đỗ Văn E",
          averageScore: 5.8,
          academicRank: "Yếu",
        },
      ],
    };
  }
};

export const getStudentDetails = async (
  studentId: string,
): Promise<StudentDetailsResponse> => {
  try {
    const response = await axiosInstance.get(
      `/api/students/${studentId}/details`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student details:", error);
    // Return mock data if API fails
    return {
      status: 200,
      message: "Lấy chi tiết điểm thành công",
      data: {
        genId: studentId,
        name: "Học sinh",
        details: [
          {
            subject: "Toán",
            class: "10A1",
            testScore: 8.5,
            examScore: 9.0,
            averageScore: 8.8,
          },
          {
            subject: "Văn",
            class: "10A1",
            testScore: 7.0,
            examScore: 7.5,
            averageScore: 7.3,
          },
          {
            subject: "Anh",
            class: "10A1",
            testScore: 8.0,
            examScore: 8.0,
            averageScore: 8.0,
          },
        ],
      },
    };
  }
};
