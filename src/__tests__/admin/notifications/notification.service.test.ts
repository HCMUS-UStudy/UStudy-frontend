/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
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
  const mockNotifications = [
    {
      id: "1",
      title: "Test Notification 1",
      content: "This is a test notification",
      sender: { id: "sender1", name: "Admin User" },
      receiverType: "STUDENT",
      sendDate: "2024-01-01T10:00:00Z",
      read: false,
    },
    {
      id: "2",
      title: "Test Notification 2",
      content: "This is another test notification",
      sender: { id: "sender2", name: "Teacher User" },
      receiverType: "TEACHER",
      sendDate: "2024-01-02T10:00:00Z",
      read: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getListNotification", () => {
    it("should fetch list of notifications", async () => {
      const mockResponse = {
        data: {
          data: {
            content: mockNotifications,
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
      expect(result).toEqual(mockNotifications);
    });

    it("should handle API errors", async () => {
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
  });

  describe("getListNotificationByClass", () => {
    it("should fetch notifications by class ID", async () => {
      const mockResponse = {
        data: {
          data: {
            content: mockNotifications,
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotificationByClass("class123");

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/notification/list-by-class/class123",
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
      expect(result).toEqual(mockNotifications);
    });

    it("should handle class not found", async () => {
      mockAxios.get.mockRejectedValue(new Error("Class not found"));

      await expect(getListNotificationByClass("nonexistent")).rejects.toThrow(
        "Class not found",
      );
    });
  });

  describe("getNotificationDetails", () => {
    it("should fetch notification details by ID", async () => {
      const mockResponse = {
        data: {
          data: mockNotifications[0],
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getNotificationDetails("1");

      expect(mockAxios.get).toHaveBeenCalledWith("/notification/details/1", {
        params: {
          page: 0,
          limit: 100,
        },
      });
      expect(result).toEqual(mockNotifications[0]);
    });

    it("should handle notification not found", async () => {
      mockAxios.get.mockRejectedValue(new Error("Notification not found"));

      await expect(getNotificationDetails("999")).rejects.toThrow(
        "Notification not found",
      );
    });
  });

  describe("createNotification", () => {
    it("should create a new notification", async () => {
      const newNotification = {
        title: "New Notification",
        content: "This is a new notification",
        receiverType: "STUDENT",
        receiverId: "student1",
      };

      const mockResponse = {
        data: {
          data: {
            id: "3",
            ...newNotification,
            sender: { id: "sender1", name: "Admin User" },
            sendDate: "2024-01-03T10:00:00Z",
            read: false,
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createNotification(newNotification);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/notification/create-notification",
        {
          ...newNotification,
          type: "ANNOUNCEMENT",
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle creation errors", async () => {
      const newNotification = {
        title: "New Notification",
        content: "This is a new notification",
        receiverType: "STUDENT",
        receiverId: "student1",
      };

      mockAxios.post.mockRejectedValue(
        new Error("Failed to create notification"),
      );

      await expect(createNotification(newNotification)).rejects.toThrow(
        "Failed to create notification",
      );
    });

    it("should use custom type when provided", async () => {
      const newNotification = {
        title: "New Notification",
        content: "This is a new notification",
        receiverType: "STUDENT",
        receiverId: "student1",
        type: "REMINDER",
      };

      const mockResponse = {
        data: {
          data: {
            id: "3",
            ...newNotification,
          },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      await createNotification(newNotification);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/notification/create-notification",
        {
          ...newNotification,
          type: "REMINDER",
        },
      );
    });
  });

  describe("updateNotification", () => {
    it("should update an existing notification", async () => {
      const updateData = {
        title: "Updated Notification",
        content: "This is an updated notification",
      };

      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...updateData,
            sender: { id: "sender1", name: "Admin User" },
            receiverType: "STUDENT",
            sendDate: "2024-01-01T10:00:00Z",
            read: false,
          },
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await updateNotification("1", updateData);

      expect(mockAxios.put).toHaveBeenCalledWith("/notification/update/1", {
        ...updateData,
        type: "ANNOUNCEMENT",
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle update errors", async () => {
      const updateData = {
        title: "Updated Notification",
      };

      mockAxios.put.mockRejectedValue(
        new Error("Failed to update notification"),
      );

      await expect(updateNotification("1", updateData)).rejects.toThrow(
        "Failed to update notification",
      );
    });

    it("should use custom type when provided", async () => {
      const updateData = {
        title: "Updated Notification",
        type: "REMINDER",
      };

      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...updateData,
          },
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      await updateNotification("1", updateData);

      expect(mockAxios.put).toHaveBeenCalledWith("/notification/update/1", {
        ...updateData,
        type: "REMINDER",
      });
    });
  });

  describe("deleteClassNotiForUser", () => {
    it("should delete notifications for a class", async () => {
      const mockResponse = {
        data: {
          data: {
            success: true,
            message: "Notifications deleted successfully",
          },
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteClassNotiForUser("class123", ["1", "2"]);

      expect(mockAxios.delete).toHaveBeenCalledWith("/notification/delete", {
        data: {
          ids: ["1", "2"],
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle deletion errors", async () => {
      mockAxios.delete.mockRejectedValue(
        new Error("Failed to delete notifications"),
      );

      await expect(deleteClassNotiForUser("class123", ["1"])).rejects.toThrow(
        "Failed to delete notifications",
      );
    });
  });

  describe("markAllNotificationsAsRead", () => {
    it("should mark all notifications as read", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "All notifications marked as read",
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const result = await markAllNotificationsAsRead();

      expect(mockAxios.put).toHaveBeenCalledWith(
        "/notification/mark-all-as-read",
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle mark as read errors", async () => {
      mockAxios.put.mockRejectedValue(new Error("Failed to mark as read"));

      await expect(markAllNotificationsAsRead()).rejects.toThrow(
        "Failed to mark as read",
      );
    });
  });

  describe("Service integration tests", () => {
    it("should handle network errors gracefully", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network error"));
      await expect(getListNotification()).rejects.toThrow("Network error");
    });

    it("should handle timeout errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Request timeout"));
      await expect(getListNotification()).rejects.toThrow("Request timeout");
    });

    it("should handle 404 errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Notification not found"));
      await expect(getNotificationDetails("nonexistent")).rejects.toThrow(
        "Notification not found",
      );
    });

    it("should handle 403 errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Access denied"));
      await expect(getListNotification()).rejects.toThrow("Access denied");
    });

    it("should handle 500 errors", async () => {
      mockAxios.get.mockRejectedValue(new Error("Internal server error"));
      await expect(getListNotification()).rejects.toThrow(
        "Internal server error",
      );
    });
  });

  describe("Data validation", () => {
    it("should handle malformed notification data", async () => {
      const malformedData = [
        {
          id: "1",
          title: "Test",
          // Missing required fields
        },
      ];

      const mockResponse = {
        data: {
          data: {
            content: malformedData,
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotification();

      expect(result).toEqual(malformedData);
    });

    it("should handle null response data", async () => {
      const mockResponse = {
        data: {
          data: {
            content: null,
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListNotification();

      expect(result).toBeNull();
    });
  });

  describe("Batch operations", () => {
    it("should handle multiple API calls", async () => {
      const mockResponse1 = {
        data: {
          data: mockNotifications[0],
        },
      };
      const mockResponse2 = {
        data: {
          data: mockNotifications[1],
        },
      };

      mockAxios.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result1 = await getNotificationDetails("1");
      const result2 = await getNotificationDetails("2");

      expect(result1).toEqual(mockNotifications[0]);
      expect(result2).toEqual(mockNotifications[1]);
      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    });
  });
});
