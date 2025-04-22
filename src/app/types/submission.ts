import { GenderType } from "./common";

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
  submissionDate: string;
  content: string;
  files: {
    id: string;
    fileName: string;
    filePath: string;
  }[];
  score: number;
  feedback: string;
  gradedBy: {
    gender: GenderType;
    createdAt: string;
    status: "ACTIVE" | "INACTIVE";
    role: {
      id: string;
      name: string;
      defaultRoute: "ADMIN" | "USER" | "TEACHER";
    };
  } | null; // Nếu bài chưa được chấm có thể không có `gradedBy`
};
