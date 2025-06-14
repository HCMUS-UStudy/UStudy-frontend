import { UserSummary } from "./common";

export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  read: boolean;
  sender: UserSummary;
  // type:
  //   | "ANNOUNCEMENT"
  //   | "ASSIGNMENT"
  //   | "QUIZ"
  //   | "GRADE"
  //   | "SYSTEM_ALERT"
  //   | "MESSAGE";
  type: string;
  className?: string; // Optional, only for CLASS type notifications
  receiverType: string; // "CLASS" | "SYSTEM" | "USER";
};
