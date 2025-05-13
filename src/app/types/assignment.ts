import { GenderType, UserSummary } from "./common";

export type AssignmentItem = {
  id: string;
  title: string;
  duration: number;
  format: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY";
  numAttempts: number;
  startTime: string;
  endTime: string;
  createdBy: UserSummary & { gender: GenderType };
  completed: boolean;
  aclass: {
    id: string;
    name: string;
    description: string;
    grade: {
      id: string;
      name: string;
    };
    course: {
      id: string;
      name: string;
    };
  };
};

export type AssignmentData = {
  content: AssignmentItem[];
  totalPages: number;
  totalElements: number;
};
