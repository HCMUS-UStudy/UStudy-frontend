import { UserSummary } from "./common";
import { Teacher } from "./teacher";

export type ClassSchedule = {
  id: string | null;
  date: string; // Format: YYYY-MM-DD
  classSession: ClassSession | null;
  assignment: Assignment | null;
  isPassed: boolean;
};

// Class session structure
export type ClassSession = {
  id: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  clazz: {
    id: string;
    name: string;
    description?: string;
    startDate: string; // Format: YYYY-MM-DD
    endDate: string; // Format: YYYY-MM-DD
    grade: {
      id: string;
      name: string;
    };
    course: {
      id: string;
      name: string;
    };
    teacher: UserSummary[]; // Array of teachers
  };
  session: {
    id: string;
    name: string;
    startTime: string; // Format: HH:mm:ss
    endTime: string; // Format: HH:mm:ss
  };
  room: {
    id: string;
    name: string;
  } | null;
};

// Branch schedule class session structure (extended version for branch API)
export type BranchClassSession = {
  id: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  clazz: {
    id: string;
    name: string;
    description: string;
    fee: number;
    startDate: string; // Format: YYYY-MM-DD
    endDate: string; // Format: YYYY-MM-DD
    numLessons: number;
    grade: {
      id: string;
      name: string;
    };
    course: {
      id: string;
      name: string;
    };
    teachers: Teacher[];
    classSessions: {
      id: string;
      day:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY";
      session: {
        id: string;
        name: string;
        startTime: string; // Format: HH:mm:ss
        endTime: string; // Format: HH:mm:ss
      };
      room: {
        id: string;
        name: string;
      };
    }[];
  };
  session: {
    id: string;
    name: string;
    startTime: string; // Format: HH:mm:ss
    endTime: string; // Format: HH:mm:ss
  };
  room: {
    id: string;
    name: string;
  };
};

// Branch schedule structure
export type BranchSchedule = {
  id: string;
  date: string; // Format: YYYY-MM-DD
  classSession: BranchClassSession;
  isPassed: boolean;
};

// Assignment structure
export type Assignment = {
  id: string;
  title: string;
  clazz: {
    id: string;
    name: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    grade: {
      id: string;
      name: string;
    };
    course: {
      id: string;
      name: string;
    };
    teacher: Teacher | null;
  };
  startTime: string; // Format: YYYY-MM-DDTHH:mm:ss
  endTime: string; // Format: YYYY-MM-DDTHH:mm:ss
  format: "ESSAY" | "MULTIPLE_CHOICE" | string;
  submitted: boolean;
};
