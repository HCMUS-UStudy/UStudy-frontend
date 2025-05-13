import { GenderType, UserSummary } from "./common";

export type AttendanceItem = {
  user: UserSummary & { gender: GenderType };
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; // Tuỳ chỉnh nếu có nhiều trạng thái
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
