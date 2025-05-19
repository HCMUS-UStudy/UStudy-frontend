import { UserSummary } from "./common";

export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  read: boolean;
  sender: UserSummary;
  type: string;
};
