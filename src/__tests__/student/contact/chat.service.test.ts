import { getAllRooms, getAllMessages } from "@/app/lib/services/chat";
import axiosInstance from "@/app/lib/axios";

// Mock axios instance
jest.mock("@/app/lib/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Chat Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRooms", () => {
    const mockRoomsResponse = {
      data: {
        data: {
          content: [
            {
              roomChatId: "1",
              user: {
                id: "1",
                genId: "T001",
                email: "nguyenvana@example.com",
                name: "Nguyễn Văn A",
                avatar: "/avatars/teacher1.jpg",
              },
              listClassName: ["10A1", "10A2", "11A1"],
              unreadCount: 3,
            },
            {
              roomChatId: "2",
              user: {
                id: "2",
                genId: "T002",
                email: "tranthib@example.com",
                name: "Trần Thị B",
                avatar: "",
              },
              listClassName: ["9A1", "9A2"],
              unreadCount: 0,
            },
          ],
          totalElements: 2,
          totalPages: 1,
          pageNumber: 0,
          pageSize: 100,
          last: true,
        },
      },
    };

    it("should fetch rooms successfully with all parameters", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      const result = await getAllRooms(0, 100, "test", "user123");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: "test",
          userId: "user123",
        },
      });

      expect(result).toEqual(mockRoomsResponse.data.data);
    });

    it("should fetch rooms with default parameters", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      const result = await getAllRooms(0, 100);

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: undefined,
          userId: undefined,
        },
      });

      expect(result).toEqual(mockRoomsResponse.data.data);
    });

    it("should handle API errors", async () => {
      const errorMessage = "Network error";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getAllRooms(0, 100)).rejects.toThrow(errorMessage);
    });

    it("should handle empty response", async () => {
      const emptyResponse = {
        data: {
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            pageNumber: 0,
            pageSize: 100,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(emptyResponse);

      const result = await getAllRooms(0, 100);

      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
    });

    it("should handle pagination correctly", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      await getAllRooms(2, 50, "search", "user123");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 2,
          limit: 50,
          filter: "search",
          userId: "user123",
        },
      });
    });

    it("should handle special characters in filter", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      await getAllRooms(0, 100, "Nguyễn Văn", "user123");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: "Nguyễn Văn",
          userId: "user123",
        },
      });
    });

    it("should handle empty filter string", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      await getAllRooms(0, 100, "", "user123");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: "",
          userId: "user123",
        },
      });
    });

    it("should handle null filter", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await getAllRooms(0, 100, null as any, "user123");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: null,
          userId: "user123",
        },
      });
    });

    it("should handle undefined userId", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      await getAllRooms(0, 100, "test");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: "test",
          userId: undefined,
        },
      });
    });

    it("should handle empty userId string", async () => {
      mockAxios.get.mockResolvedValue(mockRoomsResponse);

      await getAllRooms(0, 100, "test", "");

      expect(mockAxios.get).toHaveBeenCalledWith("/room-chat/list", {
        params: {
          page: 0,
          limit: 100,
          filter: "test",
          userId: "",
        },
      });
    });
  });

  describe("getAllMessages", () => {
    const mockMessagesResponse = {
      data: {
        data: {
          content: [
            {
              id: "1",
              sender: {
                id: "1",
                genId: "T001",
                email: "nguyenvana@example.com",
                name: "Nguyễn Văn A",
                avatar: "/avatars/teacher1.jpg",
              },
              receiver: {
                id: "2",
                genId: "S001",
                email: "student@example.com",
                name: "Student",
                avatar: "",
              },
              content: "Hello, how are you?",
              sendTime: "2024-01-01T10:00:00Z",
              isSender: false,
            },
            {
              id: "2",
              sender: {
                id: "2",
                genId: "S001",
                email: "student@example.com",
                name: "Student",
                avatar: "",
              },
              receiver: {
                id: "1",
                genId: "T001",
                email: "nguyenvana@example.com",
                name: "Nguyễn Văn A",
                avatar: "/avatars/teacher1.jpg",
              },
              content: "I'm doing well, thank you!",
              sendTime: "2024-01-01T10:01:00Z",
              isSender: true,
            },
          ],
          pageNumber: 0,
          pageSize: 100,
          totalElements: 2,
          totalPages: 1,
          last: true,
        },
      },
    };

    it("should fetch messages successfully with valid roomId", async () => {
      mockAxios.get.mockResolvedValue(mockMessagesResponse);

      const result = await getAllMessages("room123", 0, 100);

      expect(mockAxios.get).toHaveBeenCalledWith("/message/list/room123", {
        params: {
          page: 0,
          limit: 100,
        },
      });

      expect(result).toEqual(mockMessagesResponse.data.data);
    });

    it("should handle null roomId", async () => {
      const result = await getAllMessages(null, 0, 100);

      expect(mockAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [],
        pageNumber: 0,
        pageSize: 100,
        last: true,
        totalElements: 0,
        totalPages: 1,
      });
    });

    it("should handle undefined roomId", async () => {
      const result = await getAllMessages(undefined, 0, 100);

      expect(mockAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [],
        pageNumber: 0,
        pageSize: 100,
        last: true,
        totalElements: 0,
        totalPages: 1,
      });
    });

    it("should handle empty string roomId", async () => {
      const result = await getAllMessages("", 0, 100);

      expect(mockAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [],
        pageNumber: 0,
        pageSize: 100,
        last: true,
        totalElements: 0,
        totalPages: 1,
      });
    });

    it("should handle API errors", async () => {
      const errorMessage = "Network error";
      mockAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getAllMessages("room123", 0, 100)).rejects.toThrow(
        errorMessage,
      );
    });

    it("should handle empty messages response", async () => {
      const emptyResponse = {
        data: {
          data: {
            content: [],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 0,
            totalPages: 0,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(emptyResponse);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
    });

    it("should handle pagination correctly", async () => {
      mockAxios.get.mockResolvedValue(mockMessagesResponse);

      await getAllMessages("room123", 2, 50);

      expect(mockAxios.get).toHaveBeenCalledWith("/message/list/room123", {
        params: {
          page: 2,
          limit: 50,
        },
      });
    });

    it("should handle messages with special characters", async () => {
      const messagesWithSpecialChars = {
        data: {
          data: {
            content: [
              {
                id: "1",
                sender: {
                  id: "1",
                  genId: "T001",
                  email: "nguyenvana@example.com",
                  name: "Nguyễn Văn A",
                  avatar: "/avatars/teacher1.jpg",
                },
                receiver: {
                  id: "2",
                  genId: "S001",
                  email: "student@example.com",
                  name: "Student",
                  avatar: "",
                },
                content:
                  "Message with special chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
                sendTime: "2024-01-01T10:00:00Z",
                isSender: false,
              },
            ],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(messagesWithSpecialChars);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content[0].content).toBe(
        "Message with special chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
      );
    });

    it("should handle messages with emojis", async () => {
      const messagesWithEmojis = {
        data: {
          data: {
            content: [
              {
                id: "1",
                sender: {
                  id: "1",
                  genId: "T001",
                  email: "nguyenvana@example.com",
                  name: "Nguyễn Văn A",
                  avatar: "/avatars/teacher1.jpg",
                },
                receiver: {
                  id: "2",
                  genId: "S001",
                  email: "student@example.com",
                  name: "Student",
                  avatar: "",
                },
                content: "Hello! 😊 How are you? 👍",
                sendTime: "2024-01-01T10:00:00Z",
                isSender: false,
              },
            ],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(messagesWithEmojis);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content[0].content).toBe("Hello! 😊 How are you? 👍");
    });

    it("should handle very long messages", async () => {
      const longMessage = "A".repeat(1000);
      const messagesWithLongContent = {
        data: {
          data: {
            content: [
              {
                id: "1",
                sender: {
                  id: "1",
                  genId: "T001",
                  email: "nguyenvana@example.com",
                  name: "Nguyễn Văn A",
                  avatar: "/avatars/teacher1.jpg",
                },
                receiver: {
                  id: "2",
                  genId: "S001",
                  email: "student@example.com",
                  name: "Student",
                  avatar: "",
                },
                content: longMessage,
                sendTime: "2024-01-01T10:00:00Z",
                isSender: false,
              },
            ],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(messagesWithLongContent);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content[0].content).toBe(longMessage);
      expect(result.content[0].content.length).toBe(1000);
    });

    it("should handle empty message content", async () => {
      const messagesWithEmptyContent = {
        data: {
          data: {
            content: [
              {
                id: "1",
                sender: {
                  id: "1",
                  genId: "T001",
                  email: "nguyenvana@example.com",
                  name: "Nguyễn Văn A",
                  avatar: "/avatars/teacher1.jpg",
                },
                receiver: {
                  id: "2",
                  genId: "S001",
                  email: "student@example.com",
                  name: "Student",
                  avatar: "",
                },
                content: "",
                sendTime: "2024-01-01T10:00:00Z",
                isSender: false,
              },
            ],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(messagesWithEmptyContent);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content[0].content).toBe("");
    });

    it("should handle malformed API response", async () => {
      mockAxios.get.mockRejectedValue(new Error("Malformed response"));

      await expect(getAllMessages("room123", 0, 100)).rejects.toThrow();
    });

    it("should handle network timeout", async () => {
      mockAxios.get.mockRejectedValue(new Error("timeout of 5000ms exceeded"));

      await expect(getAllMessages("room123", 0, 100)).rejects.toThrow(
        "timeout of 5000ms exceeded",
      );
    });

    it("should handle 404 error", async () => {
      const error = new Error("Request failed with status code 404");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response = {
        status: 404,
        data: { message: "Room not found" },
      };
      mockAxios.get.mockRejectedValue(error);

      await expect(getAllMessages("nonexistent", 0, 100)).rejects.toThrow(
        "Request failed with status code 404",
      );
    });

    it("should handle 500 error", async () => {
      const error = new Error("Request failed with status code 500");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response = {
        status: 500,
        data: { message: "Internal server error" },
      };
      mockAxios.get.mockRejectedValue(error);

      await expect(getAllMessages("room123", 0, 100)).rejects.toThrow(
        "Request failed with status code 500",
      );
    });
  });

  describe("Data Validation", () => {
    it("should validate room data structure", async () => {
      const validRoomResponse = {
        data: {
          data: {
            content: [
              {
                roomChatId: "1",
                user: {
                  id: "1",
                  genId: "T001",
                  email: "test@example.com",
                  name: "Test User",
                  avatar: "/avatar.jpg",
                },
                listClassName: ["10A1"],
                unreadCount: 5,
              },
            ],
            totalElements: 1,
            totalPages: 1,
            pageNumber: 0,
            pageSize: 100,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(validRoomResponse);

      const result = await getAllRooms(0, 100);

      expect(result.content[0]).toHaveProperty("roomChatId");
      expect(result.content[0]).toHaveProperty("user");
      expect(result.content[0]).toHaveProperty("listClassName");
      expect(result.content[0]).toHaveProperty("unreadCount");
      expect(result.content[0].user).toHaveProperty("id");
      expect(result.content[0].user).toHaveProperty("name");
      expect(result.content[0].user).toHaveProperty("email");
    });

    it("should validate message data structure", async () => {
      const validMessageResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                sender: {
                  id: "1",
                  genId: "T001",
                  email: "test@example.com",
                  name: "Test User",
                  avatar: "/avatar.jpg",
                },
                receiver: {
                  id: "2",
                  genId: "S001",
                  email: "student@example.com",
                  name: "Student",
                  avatar: "",
                },
                content: "Test message",
                sendTime: "2024-01-01T10:00:00Z",
                isSender: false,
              },
            ],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        },
      };

      mockAxios.get.mockResolvedValue(validMessageResponse);

      const result = await getAllMessages("room123", 0, 100);

      expect(result.content[0]).toHaveProperty("id");
      expect(result.content[0]).toHaveProperty("sender");
      expect(result.content[0]).toHaveProperty("receiver");
      expect(result.content[0]).toHaveProperty("content");
      expect(result.content[0]).toHaveProperty("sendTime");
      expect(result.content[0]).toHaveProperty("isSender");
    });
  });
});
