import { BasePaginationResponse, UserSummary } from "@/app/types/common";

export type RoomChatItem = {
  roomChatId: string;
  listClassName: string[];
  user: UserSummary;
  unreadCount: number;
};

export type RoomChat = BasePaginationResponse<RoomChatItem>;

export type MessageItem = {
  id: string;
  sender: UserSummary;
  receiver: UserSummary;
  content: string;
  sendTime: string;
  isSender: boolean;
};

export type MessageList = BasePaginationResponse<MessageItem> & {
  pageNumber: number;
  pageSize: number;
  last: boolean;
};
