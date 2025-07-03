import {
  getAllClasses,
  getClassById,
  createNewClass,
  getAllStudentClasses,
  getListMembers,
  addMembers,
  removeMembers,
} from "@/app/lib/services/class";
import axiosInstance from "@/app/lib/axios";

// Mock axios instance
jest.mock("@/app/lib/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Class Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllClasses", () => {
    const mockResponse = {
      data: {
        data: {
          content: [
            {
              id: "class-1",
              name: "Mathematics 101",
              course: { name: "Mathematics" },
              grade: { name: "Grade 10" },
              fee: 500000,
              startDate: "2024-01-01",
              endDate: "2024-06-30",
            },
          ],
          totalPages: 3,
          totalElements: 15,
          currentPage: 1,
          size: 5,
        },
      },
    };

    it("fetches classes successfully", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllClasses("test", 1, 5);

      expect(mockAxios.get).toHaveBeenCalledWith("/class/list", {
        params: {
          page: 1,
          limit: 5,
          name: "test",
          course: undefined,
          grade: undefined,
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("fetches classes with course and grade filters", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      await getAllClasses("test", 1, 5, "course-1", "grade-1");

      expect(mockAxios.get).toHaveBeenCalledWith("/class/list", {
        params: {
          page: 1,
          limit: 5,
          name: "test",
          course: "course-1",
          grade: "grade-1",
        },
      });
    });

    it("throws error when API call fails", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(getAllClasses("test", 1, 5)).rejects.toThrow("API Error");
    });
  });

  describe("getClassById", () => {
    const mockClassDetail = {
      id: "class-1",
      name: "Mathematics 101",
      description: "Advanced mathematics course",
      course: { name: "Mathematics" },
      grade: { name: "Grade 10" },
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      status: "PROGRESS",
    };

    const mockResponse = {
      data: {
        data: mockClassDetail,
      },
    };

    it("fetches class by ID successfully", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getClassById("class-1");

      expect(mockAxios.get).toHaveBeenCalledWith("/class/details/class-1");
      expect(result).toEqual(mockClassDetail);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("Class not found");
      mockAxios.get.mockRejectedValue(error);

      await expect(getClassById("invalid-id")).rejects.toThrow(
        "Class not found",
      );
    });
  });

  describe("createNewClass", () => {
    const mockClassData = {
      name: "New Class",
      courseId: "course-1",
      gradeId: "grade-1",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      description: "New class description",
      fee: 500000,
      branchId: "branch-1",
      classTimes: [],
      roomId: "room-1",
      numLessons: 10,
    };

    const mockResponse = {
      data: {
        id: "new-class-id",
        ...mockClassData,
      },
    };

    it("creates class successfully", async () => {
      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await createNewClass(mockClassData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/class/create",
        mockClassData,
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error when creation fails", async () => {
      const error = new Error("Creation failed");
      mockAxios.post.mockRejectedValue(error);

      await expect(createNewClass(mockClassData)).rejects.toThrow(
        "Creation failed",
      );
    });
  });

  describe("getAllStudentClasses", () => {
    const mockResponse = {
      data: {
        data: {
          content: [
            {
              id: "class-1",
              name: "Mathematics 101",
              description: "Math course",
              course: { id: "course-1", name: "Mathematics" },
              grade: { id: "grade-1", name: "Grade 10" },
            },
          ],
          totalPages: 1,
          totalElements: 1,
          currentPage: 1,
          size: 5,
        },
      },
    };

    it("fetches student classes successfully", async () => {
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllStudentClasses(
        1,
        5,
        "math",
        "course-1",
        "grade-1",
      );

      expect(mockAxios.get).toHaveBeenCalledWith("/class/list", {
        params: {
          page: 1,
          limit: 5,
          name: "math",
          courseId: "course-1",
          gradeId: "grade-1",
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("Failed to fetch");
      mockAxios.get.mockRejectedValue(error);

      await expect(getAllStudentClasses(1, 5)).rejects.toThrow(
        "Failed to fetch",
      );
    });
  });

  describe("getListMembers", () => {
    const mockMembersResponse = {
      data: {
        data: {
          content: [
            {
              id: "user-1",
              name: "John Doe",
              email: "john@example.com",
              role: "STUDENT",
            },
          ],
          totalPages: 1,
          totalElements: 1,
          currentPage: 1,
          size: 10,
        },
      },
    };

    it("fetches class members successfully", async () => {
      mockAxios.get.mockResolvedValue(mockMembersResponse);

      const result = await getListMembers("class-1", "john", 1, 10, "STUDENT");

      expect(mockAxios.get).toHaveBeenCalledWith("/class-member/list/class-1", {
        params: {
          page: 1,
          limit: 10,
          role: "STUDENT",
          filter: "john",
        },
      });
      expect(result).toEqual(mockMembersResponse.data.data);
    });

    it("fetches members without role filter", async () => {
      mockAxios.get.mockResolvedValue(mockMembersResponse);

      await getListMembers("class-1", "john", 1, 10);

      expect(mockAxios.get).toHaveBeenCalledWith("/class-member/list/class-1", {
        params: {
          page: 1,
          limit: 10,
          role: undefined,
          filter: "john",
        },
      });
    });

    it("throws error when API call fails", async () => {
      const error = new Error("Failed to fetch members");
      mockAxios.get.mockRejectedValue(error);

      await expect(getListMembers("class-1", "", 1, 10)).rejects.toThrow(
        "Failed to fetch members",
      );
    });
  });

  describe("addMembers", () => {
    const mockAddResponse = {
      data: {
        failedCount: 0,
        failedMembers: [],
      },
    };

    it("adds members successfully", async () => {
      mockAxios.post.mockResolvedValue(mockAddResponse);

      const result = await addMembers(
        ["user-1", "user-2"],
        "class-1",
        "STUDENT",
      );

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/class-member/add/class-1",
        ["user-1", "user-2"],
        {
          params: {
            role: "STUDENT",
          },
        },
      );
      expect(result).toEqual(mockAddResponse.data);
    });

    it("throws error when adding members fails", async () => {
      const error = new Error("Failed to add members");
      mockAxios.post.mockRejectedValue(error);

      await expect(
        addMembers(["user-1"], "class-1", "STUDENT"),
      ).rejects.toThrow("Failed to add members");
    });
  });

  describe("removeMembers", () => {
    const mockRemoveResponse = {
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 1,
        size: 10,
      },
    };

    it("removes members successfully", async () => {
      mockAxios.delete.mockResolvedValue(mockRemoveResponse);

      const result = await removeMembers("class-1", ["user-1", "user-2"]);

      expect(mockAxios.delete).toHaveBeenCalledWith(
        "/class-member/remove/class-1",
        {
          data: ["user-1", "user-2"],
        },
      );
      expect(result).toEqual(mockRemoveResponse.data);
    });

    it("throws error when removing members fails", async () => {
      const error = new Error("Failed to remove members");
      mockAxios.delete.mockRejectedValue(error);

      await expect(removeMembers("class-1", ["user-1"])).rejects.toThrow(
        "Failed to remove members",
      );
    });
  });
});
