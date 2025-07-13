import { GenderType, UserSummary } from "./common";

export interface SubmissionSchema {
  content: string;
  files: File[];
}

export interface UpdateSubmissionSchema {
  content: string;
  addedFiles: File[];
  deletedFiles: string[];
}

export type SubmissionItem = {
  id: string;
  student: UserSummary & { gender: GenderType };
  submissionDate: string;
  score: number;
  feedback: string;
  gradedBy: (UserSummary & { gender: GenderType }) | null;
};

export type SubmissionData = {
  content: SubmissionItem[];
  totalPages: number;
  totalElements: number;
};

export type SubmitSumission = {
  duration: number;
  answers: {
    questionId: string;
    content: string;
    files: File[];
    optionId: string;
  }[];
};

export type SubmissionDetail = {
  assignmentId: string;
  title: string;
  score: number;
  feedback: string;
  questions: {
    questionId: string;
    questionType: "MULTIPLE_CHOICE" | "ESSAY";
    description: string;
    fileName: string | null;
    score: number;
    maxScore: number;
    feedback: string | null;

    // MULTIPLE_CHOICE fields
    isCorrect?: boolean;
    selectedOption?: {
      optionId: string;
      description: string;
      isCorrect: boolean;
    };
    correctOption?: {
      optionId: string;
      description: string;
      isCorrect: boolean;
    };
    allOptions?: {
      optionId: string;
      description: string;
      isCorrect: boolean;
    }[];

    // ESSAY fields
    content?: string;
    files?: {
      id: string;
      fileName: string;
      filePath: string;
    }[];
  }[];
};
