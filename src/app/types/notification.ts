import { UserSummary } from "./common";

export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  read: boolean;
  sender: UserSummary;
  type:
    | "ANNOUNCEMENT"
    | "ASSIGNMENT"
    | "QUIZ"
    | "GRADE"
    | "SYSTEM_ALERT"
    | "MESSAGE";
  className?: string;
  receiverType: "CLASS" | "SYSTEM" | "USER";
};
