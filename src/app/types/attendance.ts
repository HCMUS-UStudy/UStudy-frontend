import { MemberItem } from "./member";

export type AttendanceItem = {
  user: MemberItem;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; // Tuỳ chỉnh nếu có nhiều trạng thái
  note: string;
  recordedAt: string; // ISO Date string (YYYY-MM-DDTHH:mm:ss.sssZ)
};

export type AttendaceData = {
  attendances: {
    content: AttendanceItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  countStatus: Record<string, number>;
};

// New types for attendance list by student API
export type AttendanceSession = {
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
    startTime: string; // Format: "07:00:00"
    endTime: string; // Format: "10:00:00"
  };
  room: {
    id: string;
    name: string;
    capacity: number;
  };
};

export type AttendanceRecord = {
  classSession: AttendanceSession;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note: string;
  date: string; // Date string
};

export type AttendanceListByStudentResponse = {
  message: string;
  statusCode: string;
  data: AttendanceRecord[];
};

export type AttendanceListByStudentParams = {
  classId: string;
  month: number;
  year: number;
  studentId?: string; // Optional, for parent's view
};
