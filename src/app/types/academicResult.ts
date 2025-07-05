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
