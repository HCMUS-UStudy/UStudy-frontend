import { GenderType, UserSummary } from "./common";

export type AssignmentMode = "PRACTICE" | "TEST";

export type AssignmentCount = {
  total: number;
  submitted: number;
  overdue: number;
};

export type AssignmentItem = {
  id: string;
  title: string;
  duration: number;
  format: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY";
  mode: "PRACTICE" | "TEST";
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
