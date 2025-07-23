export type AcademicResult = {
  assignmentScores: {
    content: Content[];
    totalPages: number;
  };
  averageScore: number;
};

export type Content = {
  id: string;
  title: string;
  studentScore: number;
  classAverageScore: number;
  submissionDate: string;
};

export type AcademicResultManage = {
  student: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string | null;
  };
  assignmentScores: Content[];
  averageScore: number;
};
