export type AttendanceItem = {
  user: {
    id: string;
    genId: string;
    email: string;
    name: string;
    gender: "MALE" | "FEMALE"; // Có thể thêm các giá trị khác nếu cần
  };
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
