import { GenderType } from "./common";

export type AssignmentItem = {
  id: string;
  title: string;
  duration: number;
  startTime: string;
  endTime: string;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    gender: GenderType;
  };
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
