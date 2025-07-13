import {
  getListNotification,
  getListNotificationByClass,
  getNotificationDetails,
  createNotification,
  updateNotification,
  deleteClassNotiForUser,
  markAllNotificationsAsRead,
} from "@/app/lib/services/notification";
import axiosInstance from "@/app/lib/axios";

// Mock axios instance
jest.mock("@/app/lib/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getListNotification", () => {
    it("should fetch list of notifications successfully", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                title: "Test Notification",
                content: "Test content",
                sendDate: "2024-01-15T10:00:00Z",
                read: false,
                sender: {
                  id: "1",
                  name: "Test User",
                  avatar: "/avatar.png",
                  email: "test@example.com",
                },
                type: "ANNOUNCEMENT",
                receiverType: "SYSTEM",
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotification();

      expect(mockAxios.get).toHaveBeenCalledWith("/notification/list", {
        params: {
          page: 0,
          limit: 100,
        },
      });
      expect(result).toEqual(mockResponse.data.data.content);
    });

    it("should handle API error", async () => {
      const errorMessage = "Failed to fetch notifications";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getListNotification()).rejects.toThrow(errorMessage);
    });

    it("should handle empty response", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotification();

      expect(result).toEqual([]);
    });

    it("should handle malformed response", async () => {
      // Mock axios to return null response
      mockAxios.get.mockResolvedValueOnce(null);

      await expect(getListNotification()).rejects.toThrow();
    });
  });

  describe("getListNotificationByClass", () => {
    it("should fetch notifications by class successfully", async () => {
      const classId = "class123";
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                title: "Class Notification",
                content: "Class content",
                sendDate: "2024-01-15T10:00:00Z",
                read: false,
                sender: {
                  id: "1",
                  name: "Teacher",
                  avatar: "/teacher.png",
                  email: "teacher@example.com",
                },
                type: "ANNOUNCEMENT",
                receiverType: "CLASS",
                className: "Math 101",
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotificationByClass(classId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/notification/list-by-class/${classId}`,
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
      expect(result).toEqual(mockResponse.data.data.content);
    });

    it("should handle API error for class notifications", async () => {
      const classId = "class123";
      const errorMessage = "Failed to fetch class notifications";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getListNotificationByClass(classId)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("getNotificationDetails", () => {
    it("should fetch notification details successfully", async () => {
      const notificationId = "notif123";
      const mockResponse = {
        data: {
          data: {
            id: "notif123",
            title: "Detailed Notification",
            content: "Detailed content",
            sendDate: "2024-01-15T10:00:00Z",
            read: false,
            sender: {
              id: "1",
              name: "Admin",
              avatar: "/admin.png",
              email: "admin@example.com",
            },
            type: "ANNOUNCEMENT",
            receiverType: "SYSTEM",
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getNotificationDetails(notificationId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/notification/details/${notificationId}`,
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle API error for notification details", async () => {
      const notificationId = "notif123";
      const errorMessage = "Failed to fetch notification details";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getNotificationDetails(notificationId)).rejects.toThrow(
        errorMessage,
      );
    });

    it("should handle notification not found", async () => {
      const notificationId = "notif123";
      const mockResponse = {
        data: {
          data: null,
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getNotificationDetails(notificationId);

      expect(result).toBeNull();
    });
  });

  describe("createNotification", () => {
    it("should create notification successfully", async () => {
      const notificationData = {
        receiverId: "user123",
        title: "New Notification",
        content: "New notification content",
        type: "ANNOUNCEMENT",
        receiverType: "USER",
      };

      const mockResponse = {
        data: {
          data: {
            id: "new123",
            ...notificationData,
            sendDate: "2024-01-15T10:00:00Z",
            read: false,
            sender: {
              id: "1",
              name: "System",
              avatar: "/system.png",
              email: "system@example.com",
            },
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createNotification(notificationData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/notification/create-notification",
        {
          ...notificationData,
          type: "ANNOUNCEMENT",
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create notification with default type", async () => {
      const notificationData = {
        receiverId: "user123",
        title: "New Notification",
        content: "New notification content",
        receiverType: "USER",
      };

      const mockResponse = {
        data: {
          data: {
            id: "new123",
            ...notificationData,
            type: "ANNOUNCEMENT",
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      await createNotification(notificationData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/notification/create-notification",
        {
          ...notificationData,
          type: "ANNOUNCEMENT",
        },
      );
    });

    it("should handle API error for creating notification", async () => {
      const notificationData = {
        title: "New Notification",
        content: "New notification content",
      };

      const errorMessage = "Failed to create notification";
      mockAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(createNotification(notificationData)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("updateNotification", () => {
    it("should update notification successfully", async () => {
      const notificationId = "notif123";
      const updateData = {
        title: "Updated Notification",
        content: "Updated content",
        type: "ASSIGNMENT",
      };

      const mockResponse = {
        data: {
          data: {
            id: notificationId,
            ...updateData,
            sendDate: "2024-01-15T10:00:00Z",
            read: false,
            sender: {
              id: "1",
              name: "Admin",
              avatar: "/admin.png",
              email: "admin@example.com",
            },
            receiverType: "SYSTEM",
          },
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await updateNotification(notificationId, updateData);

      expect(mockAxios.put).toHaveBeenCalledWith(
        `/notification/update/${notificationId}`,
        {
          ...updateData,
          type: "ASSIGNMENT",
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should update notification with default type", async () => {
      const notificationId = "notif123";
      const updateData = {
        title: "Updated Notification",
        content: "Updated content",
      };

      const mockResponse = {
        data: {
          data: {
            id: notificationId,
            ...updateData,
            type: "ANNOUNCEMENT",
          },
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      await updateNotification(notificationId, updateData);

      expect(mockAxios.put).toHaveBeenCalledWith(
        `/notification/update/${notificationId}`,
        {
          ...updateData,
          type: "ANNOUNCEMENT",
        },
      );
    });

    it("should handle API error for updating notification", async () => {
      const notificationId = "notif123";
      const updateData = {
        title: "Updated Notification",
      };

      const errorMessage = "Failed to update notification";
      mockAxios.put.mockRejectedValue(new Error(errorMessage));

      await expect(
        updateNotification(notificationId, updateData),
      ).rejects.toThrow(errorMessage);
    });

    it("should handle undefined notification ID", async () => {
      const updateData = {
        title: "Updated Notification",
      };

      const mockResponse = {
        data: {
          data: {
            id: undefined,
            ...updateData,
          },
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await updateNotification(undefined, updateData);

      expect(mockAxios.put).toHaveBeenCalledWith(
        "/notification/update/undefined",
        {
          ...updateData,
          type: "ANNOUNCEMENT",
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe("deleteClassNotiForUser", () => {
    it("should delete class notifications successfully", async () => {
      const classId = "class123";
      const notificationIds = ["notif1", "notif2", "notif3"];

      const mockResponse = {
        data: {
          data: {
            deletedCount: 3,
            message: "Notifications deleted successfully",
          },
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteClassNotiForUser(classId, notificationIds);

      expect(mockAxios.delete).toHaveBeenCalledWith("/notification/delete", {
        data: {
          ids: notificationIds,
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle empty notification IDs array", async () => {
      const classId = "class123";
      const notificationIds: string[] = [];

      const mockResponse = {
        data: {
          data: {
            deletedCount: 0,
            message: "No notifications to delete",
          },
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteClassNotiForUser(classId, notificationIds);

      expect(mockAxios.delete).toHaveBeenCalledWith("/notification/delete", {
        data: {
          ids: [],
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle API error for deleting notifications", async () => {
      const classId = "class123";
      const notificationIds = ["notif1"];

      const errorMessage = "Failed to delete notifications";
      mockAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(
        deleteClassNotiForUser(classId, notificationIds),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("markAllNotificationsAsRead", () => {
    it("should mark all notifications as read successfully", async () => {
      const mockResponse = {
        data: {
          message: "All notifications marked as read",
          updatedCount: 5,
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await markAllNotificationsAsRead();

      expect(mockAxios.put).toHaveBeenCalledWith(
        "/notification/mark-all-as-read",
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error for marking all as read", async () => {
      const errorMessage = "Failed to mark notifications as read";
      mockAxios.put.mockRejectedValue(new Error(errorMessage));

      await expect(markAllNotificationsAsRead()).rejects.toThrow(errorMessage);
    });

    it("should handle empty response", async () => {
      const mockResponse = {
        data: {
          message: "No notifications to mark as read",
          updatedCount: 0,
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await markAllNotificationsAsRead();

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error");
      mockAxios.get.mockRejectedValue(networkError);

      await expect(getListNotification()).rejects.toThrow("Network Error");
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      mockAxios.get.mockRejectedValue(timeoutError);

      await expect(getListNotification()).rejects.toThrow("Request timeout");
    });
  });

  describe("Request Parameters", () => {
    it("should use correct pagination parameters", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      await getListNotification();

      expect(mockAxios.get).toHaveBeenCalledWith("/notification/list", {
        params: {
          page: 0,
          limit: 100,
        },
      });
    });

    it("should use correct class ID in URL", async () => {
      const classId = "test-class-id";
      const mockResponse = {
        data: {
          data: {
            content: [],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      await getListNotificationByClass(classId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/notification/list-by-class/${classId}`,
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
    });

    it("should use correct notification ID in URL", async () => {
      const notificationId = "test-notification-id";
      const mockResponse = {
        data: {
          data: {},
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      await getNotificationDetails(notificationId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/notification/details/${notificationId}`,
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
    });
  });
});
