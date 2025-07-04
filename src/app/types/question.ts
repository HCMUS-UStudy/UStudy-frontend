export type Question = {
  id: string;
  description: string;
  fileName: string | null;
  grade: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  questionType: "MULTIPLE_CHOICE" | "ESSAY";
  lastModified: string;
  options?: {
    id: string;
    description: string;
    isCorrect: boolean;
  }[];
  scoringCriteria: string | null;
};
