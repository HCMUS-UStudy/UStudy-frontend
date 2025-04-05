export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  read: boolean;
  sender: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
  };
  type: string;
};
