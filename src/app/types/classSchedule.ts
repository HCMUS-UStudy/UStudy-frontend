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
    teacher: Teacher | null;
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
