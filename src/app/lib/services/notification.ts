import axiosInstance from "@/app/lib/axios";
import { NotificationItem } from "@/app/types";

export const getListNotification = async () => {
  const response = await axiosInstance.get("/notification/list", {
    params: {
      page: 0,
      limit: 100,
    },
  });
  return response.data.data.content;
};

export const getListNotificationByClass = async (classId: string) => {
  const response = await axiosInstance.get(
    `/notification/list-by-class/${classId}`,
    {
      params: {
        page: 0,
        limit: 100,
      },
      id: `getListNotificationByClass_${classId}`,
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

export const createClassNotification = async (
  classId: string,
  body: {
    receiverId?: string;
    title?: string;
    content?: string;
    type?: string;
  },
) => {
  const response = await axiosInstance.post(
    "/notification/create-class-noti",
    {
      ...body,
      type: body.type ?? "ANNOUNCEMENT",
    },
    {
      cache: {
        update: {
          [`getListNotificationByClass_${classId}`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
            response,
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content.push(response.data.data);
            return cached;
          },
        },
      },
    },
  );
  return response.data.data;
};

export const updateClassNotification = async (
  classId: string,
  notiId: string | undefined,
  body: {
    title?: string;
    content?: string;
    type?: string;
  },
) => {
  const response = await axiosInstance.put(
    `/notification/update/${notiId}`,
    {
      ...body,
      type: body.type ?? "ANNOUNCEMENT",
    },
    {
      cache: {
        update: {
          [`getListNotificationByClass_${classId}`]: (
            cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
            response,
          ) => {
            if (cached.state !== "cached") {
              return "ignore";
            }
            cached.data.data.data.content = cached.data.data.data.content.map(
              (item: NotificationItem) => {
                if (item.id === response.data.data.id) {
                  return response.data.data;
                }
                return item;
              },
            );
            return cached;
          },
        },
      },
    },
  );
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
    cache: {
      update: {
        [`getListNotificationByClass_${classId}`]: (
          cached: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ) => {
          if (cached.state !== "cached") {
            return "ignore";
          }
          cached.data.data.data.content = cached.data.data.data.content.filter(
            (item: NotificationItem) => !ids.includes(item.id),
          );
          return cached;
        },
      },
    },
  });
  return response.data.data;
};
