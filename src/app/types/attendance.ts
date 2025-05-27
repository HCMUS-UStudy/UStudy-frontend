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
