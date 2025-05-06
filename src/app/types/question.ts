export type Question = {
  id: string;
  description: string;
  fileName: string;
  grade: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  questionType: "MULTIPLE_CHOICE" | "ESSAY";
  createdAt: string;
  options: {
    id: string;
    description: string;
    isCorrect: boolean;
  }[];
};
