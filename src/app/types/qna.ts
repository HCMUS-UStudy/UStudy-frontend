export type QnA = {
  id: string;
  description: string;
  fileName?: string;
  grade: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  questionType: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY";
  createdAt: string;
  options: {
    id: string;
    description: string;
    isCorrect: boolean;
  }[];
  files?: File[];
};

export type QnAData = {
  content: QnA[];
  totalPages: number;
  totalElements: number;
};
