import axiosInstance from "@/app/lib/axios";

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

export const createClassNotification = async (body: {
  receiverId: string;
  title: string;
  content: string;
  type?: string;
}) => {
  const response = await axiosInstance.post("/notification/create-class-noti", {
    ...body,
    type: body.type ?? "ANNOUNCEMENT",
  });
  return response.data.data;
};
