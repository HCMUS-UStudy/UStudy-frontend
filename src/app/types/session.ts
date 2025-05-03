export type DaysInWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SessionResponse = {
  message: string;
  statusCode: string;
  data: Session | null;
};

export type SessionData = {
  content: Session[];
  totalPages: number;
};

export type Session = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type ClassSessionItem = {
  day: DaysInWeek;
  startTime: string;
  endTime: string;
  branchSessionId: string;
};

export type SessionTimeItem = {
  day: DaysInWeek;
  branchSessionId: string;
};

export type DayRoomSessionItem = {
  day: DaysInWeek;
  branchSessionId: string;
  roomId: string;
};

export type SessionBranchItem = {
  id: string;
  name: string;
};

export type SessionItem = {
  id: string;
  branch: {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
    rooms: number;
    sessions: Session[];
  };
  session: Session;
};
