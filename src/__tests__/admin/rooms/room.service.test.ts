import {
  getBranchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getAvailableRooms,
} from "@/app/lib/services/room";
import axiosInstance from "@/app/lib/axios";

// Mock axios instance
jest.mock("@/app/lib/axios");
const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Room Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBranchRooms", () => {
    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: {
          content: [
            { id: "room-1", name: "Phòng A101", capacity: 30 },
            { id: "room-2", name: "Phòng A102", capacity: 25 },
          ],
          pageNumber: 0,
          pageSize: 10,
          totalElements: 2,
          totalPages: 1,
          last: true,
        },
      },
    };

    it("fetches rooms with default pagination", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getBranchRooms("branch-1");

      expect(mockAxios.get).toHaveBeenCalledWith("/room/list/branch-1", {
        params: {
          page: 0,
          limit: 10,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("fetches rooms with custom pagination", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getBranchRooms("branch-1", 2, 20);

      expect(mockAxios.get).toHaveBeenCalledWith("/room/list/branch-1", {
        params: {
          page: 2,
          limit: 20,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(getBranchRooms("branch-1")).rejects.toThrow("API Error");
    });
  });

  describe("createRoom", () => {
    const mockRoomData = {
      name: "Phòng A101",
      capacity: 30,
    };

    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101", capacity: 30 },
      },
    };

    it("creates room successfully", async () => {
      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createRoom("branch-1", mockRoomData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/create/branch/branch-1",
        mockRoomData,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("creates room without capacity", async () => {
      const roomDataWithoutCapacity = { name: "Phòng A101" };
      mockAxios.post.mockResolvedValue(mockResponse);

      await createRoom("branch-1", roomDataWithoutCapacity);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/create/branch/branch-1",
        roomDataWithoutCapacity,
      );
    });

    it("throws error when creation fails", async () => {
      const error = new Error("Creation failed");
      mockAxios.post.mockRejectedValue(error);

      await expect(createRoom("branch-1", mockRoomData)).rejects.toThrow(
        "Creation failed",
      );
    });
  });

  describe("updateRoom", () => {
    const mockRoomData = {
      name: "Phòng A101 Updated",
      capacity: 35,
    };

    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101 Updated", capacity: 35 },
      },
    };

    it("updates room successfully", async () => {
      mockAxios.patch.mockResolvedValue(mockResponse);

      const result = await updateRoom("room-1", mockRoomData);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        "/room/update/room-1",
        mockRoomData,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("updates room without capacity", async () => {
      const roomDataWithoutCapacity = { name: "Phòng A101 Updated" };
      mockAxios.patch.mockResolvedValue(mockResponse);

      await updateRoom("room-1", roomDataWithoutCapacity);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        "/room/update/room-1",
        roomDataWithoutCapacity,
      );
    });

    it("throws error when update fails", async () => {
      const error = new Error("Update failed");
      mockAxios.patch.mockRejectedValue(error);

      await expect(updateRoom("room-1", mockRoomData)).rejects.toThrow(
        "Update failed",
      );
    });
  });

  describe("deleteRoom", () => {
    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101", capacity: 30 },
      },
    };

    it("deletes room successfully", async () => {
      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteRoom("room-1");

      expect(mockAxios.delete).toHaveBeenCalledWith("/room/delete/room-1");
      expect(result).toEqual(mockResponse.data);
    });

    it("throws error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      mockAxios.delete.mockRejectedValue(error);

      await expect(deleteRoom("room-1")).rejects.toThrow("Deletion failed");
    });
  });

  describe("getRoomById", () => {
    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101", capacity: 30 },
      },
    };

    it("fetches room by ID successfully", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getRoomById("room-1");

      expect(mockAxios.get).toHaveBeenCalledWith("/room/room-1");
      expect(result).toEqual(mockResponse.data);
    });

    it("throws error when fetching room fails", async () => {
      const error = new Error("Fetch failed");
      mockAxios.get.mockRejectedValue(error);

      await expect(getRoomById("room-1")).rejects.toThrow("Fetch failed");
    });
  });

  describe("getAvailableRooms", () => {
    const mockRequestData = {
      day: "MONDAY" as const,
      branchSessionId: "session-1",
      startDate: "2024-01-01",
      numLessons: 10,
    };

    const mockResponse = {
      data: {
        message: "Success",
        statusCode: "200",
        data: {
          content: [
            { id: "room-1", name: "Phòng A101", capacity: 30 },
            { id: "room-2", name: "Phòng A102", capacity: 25 },
          ],
          totalElements: 2,
          totalPages: 1,
        },
      },
    };

    it("fetches available rooms successfully", async () => {
      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await getAvailableRooms(
        "branch-1",
        "MONDAY",
        "session-1",
        "2024-01-01",
        10,
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/list-available/branch-1",
        mockRequestData,
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("throws error when fetching available rooms fails", async () => {
      const error = new Error("Fetch failed");
      mockAxios.post.mockRejectedValue(error);

      await expect(
        getAvailableRooms("branch-1", "MONDAY", "session-1", "2024-01-01", 10),
      ).rejects.toThrow("Fetch failed");
    });

    it("handles different days of the week", async () => {
      mockAxios.post.mockResolvedValue(mockResponse);

      await getAvailableRooms(
        "branch-1",
        "FRIDAY",
        "session-1",
        "2024-01-01",
        10,
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/list-available/branch-1",
        {
          ...mockRequestData,
          day: "FRIDAY",
        },
      );
    });

    it("handles different number of lessons", async () => {
      mockAxios.post.mockResolvedValue(mockResponse);

      await getAvailableRooms(
        "branch-1",
        "MONDAY",
        "session-1",
        "2024-01-01",
        5,
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/list-available/branch-1",
        {
          ...mockRequestData,
          numLessons: 5,
        },
      );
    });
  });

  describe("Error Handling", () => {
    it("handles network errors", async () => {
      const networkError = new Error("Network Error");
      mockAxios.get.mockRejectedValue(networkError);

      await expect(getBranchRooms("branch-1")).rejects.toThrow("Network Error");
    });

    it("handles HTTP error responses", async () => {
      const httpError = {
        response: {
          status: 404,
          data: { message: "Room not found" },
        },
      };
      mockAxios.get.mockRejectedValue(httpError);

      await expect(getBranchRooms("branch-1")).rejects.toEqual(httpError);
    });

    it("handles timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      mockAxios.post.mockRejectedValue(timeoutError);

      await expect(
        createRoom("branch-1", { name: "Test Room" }),
      ).rejects.toThrow("Request timeout");
    });
  });

  describe("Request Parameters", () => {
    it("sends correct parameters for pagination", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await getBranchRooms("branch-1", 5, 25);

      expect(mockAxios.get).toHaveBeenCalledWith("/room/list/branch-1", {
        params: {
          page: 5,
          limit: 25,
        },
      });
    });

    it("sends correct room data for creation", async () => {
      mockAxios.post.mockResolvedValue({ data: {} });

      const roomData = {
        name: "Test Room",
        capacity: 40,
      };

      await createRoom("branch-1", roomData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/create/branch/branch-1",
        roomData,
      );
    });

    it("sends correct room data for update", async () => {
      mockAxios.patch.mockResolvedValue({ data: {} });

      const roomData = {
        name: "Updated Room",
        capacity: 50,
      };

      await updateRoom("room-1", roomData);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        "/room/update/room-1",
        roomData,
      );
    });

    it("sends correct request body for available rooms", async () => {
      mockAxios.post.mockResolvedValue({ data: {} });

      await getAvailableRooms(
        "branch-1",
        "WEDNESDAY",
        "session-2",
        "2024-01-15",
        8,
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/room/list-available/branch-1",
        {
          day: "WEDNESDAY",
          branchSessionId: "session-2",
          startDate: "2024-01-15",
          numLessons: 8,
        },
      );
    });
  });
});
