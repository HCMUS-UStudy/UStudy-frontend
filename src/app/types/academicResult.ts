export interface AcademicResultAdmin {
  id: string;
  studentId: string;
  subjectId: string;
  testScore: number;
  examScore: number;
  averageScore: number;
  semester: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

// New types for student summary API
export interface StudentSummary {
  genId: string;
  name: string;
  averageScore: number;
  academicRank: string;
}

export interface StudentSummaryResponse {
  status: number;
  message: string;
  data: StudentSummary[];
}

// New types for student details API
export interface StudentDetail {
  subject: string;
  class: string;
  testScore: number;
  examScore: number;
  averageScore: number;
}

export interface StudentDetailsData {
  genId: string;
  name: string;
  details: StudentDetail[];
}

export interface StudentDetailsResponse {
  status: number;
  message: string;
  data: StudentDetailsData;
}

export type AcademicResult = {
  assignmentScores: {
    content: Content[];
    totalPages: number;
  };
  averageScore: number;
};

export type Content = {
  title: string;
  studentScore: number;
  classAverageScore: number;
  submissionDate: string;
};
