import axiosInstance from "@/app/lib/axios";
import { NotificationItem } from "@/app/types";

export const getListNotification = async (
  page: number = 0,
  limit: number = 100,
): Promise<NotificationItem[]> => {
  try {
    const response = await axiosInstance.get("/notification/list", {
      params: {
        page,
        limit,
      },
    });
    return response.data.data.content;
  } catch (error) {
    throw error;
  }
};

export const getListNotificationByClass = async (classId: string) => {
  const response = await axiosInstance.get(
    `/notification/list-by-class/${classId}`,
    {
      params: {
        page: 0,
        limit: 100,
      },
    },
  );
  return response.data.data.content;
};

export const getNotificationDetails = async (notificationId: string) => {
  const response = await axiosInstance.get(
    `/notification/details/${notificationId}`,
    {
      params: {
        page: 0,
        limit: 100,
      },
    },
  );
  return response.data.data;
};

export const createNotification = async (body: {
  receiverId?: string;
  title?: string;
  content?: string;
  type?: string;
  receiverType?: string;
}) => {
  const response = await axiosInstance.post(
    "/notification/create-notification",
    {
      ...body,
      type: body.type ?? "ANNOUNCEMENT",
    },
  );
  return response.data.data;
};

export const updateNotification = async (
  notiId: string | undefined,
  body: {
    title?: string;
    content?: string;
    type?: string;
  },
) => {
  const response = await axiosInstance.put(`/notification/update/${notiId}`, {
    ...body,
    type: body.type ?? "ANNOUNCEMENT",
  });
  return response.data.data;
};

export const deleteClassNotiForUser = async (
  classId: string,
  ids: string[],
) => {
  const response = await axiosInstance.delete("/notification/delete", {
    data: {
      ids: ids,
    },
  });
  return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put("/notification/mark-all-as-read");
  return response.data;
};
