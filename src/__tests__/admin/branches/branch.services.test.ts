import axiosInstance from "@/app/lib/axios";
import {
  getAllBranches,
  addBranch,
  assignClerks,
  getListClerk,
  getAvailableClerks,
  updateBranch,
  updateSessions,
  updateAdmins,
  getUserBranches,
} from "@/app/lib/services/branch";
import { CreateBranchInputs } from "@/app/ui/components/admin/branches/AddBranchModal";

// Mock axios instance
jest.mock("@/app/lib/axios");

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Branch Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBranches", () => {
    it("should fetch branches successfully", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                name: "Chi nhánh Hà Nội",
                address: "123 Đường ABC",
                contactNumber: "0123456789",
                rooms: 10,
                status: "ACTIVE",
                sessions: [],
              },
            ],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 1,
            totalPages: 1,
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getAllBranches(0, 5, "test");

      expect(mockAxios.get).toHaveBeenCalledWith("/branch/list", {
        params: {
          page: 0,
          limit: 5,
          filter: "test",
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle API errors", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(getAllBranches(0, 5)).rejects.toThrow("API Error");
    });
  });

  describe("addBranch", () => {
    it("should create a new branch successfully", async () => {
      const mockBranchData: CreateBranchInputs = {
        name: "Chi nhánh mới",
        address: "456 Đường XYZ",
        contactNumber: "0987654321",
        rooms: 15,
        sessions: ["1", "2"],
      };

      const mockResponse = {
        data: {
          id: "2",
          ...mockBranchData,
          status: "ACTIVE",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await addBranch(mockBranchData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        "/branch/create",
        mockBranchData,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle creation errors", async () => {
      const mockBranchData: CreateBranchInputs = {
        name: "Chi nhánh mới",
        address: "456 Đường XYZ",
        contactNumber: "0987654321",
        rooms: 15,
        sessions: ["1"],
      };

      const error = new Error("Creation failed");
      mockAxios.post.mockRejectedValue(error);

      await expect(addBranch(mockBranchData)).rejects.toThrow(
        "Creation failed",
      );
    });
  });

  describe("assignClerks", () => {
    it("should assign clerks to a branch successfully", async () => {
      const branchId = "1";
      const clerkIds = ["clerk1", "clerk2"];

      const mockResponse = {
        data: {
          message: "Clerks assigned successfully",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await assignClerks(branchId, clerkIds);

      expect(mockAxios.post).toHaveBeenCalledWith(
        `/branch/assign/${branchId}`,
        clerkIds,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle assignment errors", async () => {
      const branchId = "1";
      const clerkIds = ["clerk1"];

      const error = new Error("Assignment failed");
      mockAxios.post.mockRejectedValue(error);

      await expect(assignClerks(branchId, clerkIds)).rejects.toThrow(
        "Assignment failed",
      );
    });
  });

  describe("getListClerk", () => {
    it("should fetch clerk list for a branch successfully", async () => {
      const branchId = "1";

      const mockResponse = {
        data: {
          content: [
            {
              id: "clerk1",
              name: "Clerk 1",
              email: "clerk1@example.com",
            },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getListClerk(branchId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/branch/list-admins/${branchId}`,
        {
          params: {
            page: 0,
            limit: 100,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle fetch errors", async () => {
      const branchId = "1";

      const error = new Error("Fetch failed");
      mockAxios.get.mockRejectedValue(error);

      await expect(getListClerk(branchId)).rejects.toThrow("Fetch failed");
    });
  });

  describe("getAvailableClerks", () => {
    it("should fetch available clerks successfully", async () => {
      const mockResponse = {
        data: {
          content: [
            {
              id: "clerk1",
              name: "Available Clerk 1",
              email: "clerk1@example.com",
            },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getAvailableClerks();

      expect(mockAxios.get).toHaveBeenCalledWith("/user/list-clerks");
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Fetch failed");
      mockAxios.get.mockRejectedValue(error);

      await expect(getAvailableClerks()).rejects.toThrow("Fetch failed");
    });
  });

  describe("updateBranch", () => {
    it("should update branch successfully", async () => {
      const branchUpdate = {
        id: "1",
        name: "Updated Branch Name",
        address: "Updated Address",
        contactNumber: "0123456789",
      };

      const mockResponse = {
        data: {
          message: "Branch updated successfully",
        },
      };

      mockAxios.patch.mockResolvedValue(mockResponse);

      const result = await updateBranch(branchUpdate);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/branch/update/${branchUpdate.id}`,
        {
          name: branchUpdate.name,
          address: branchUpdate.address,
          contactNumber: branchUpdate.contactNumber,
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle update errors", async () => {
      const branchUpdate = {
        id: "1",
        name: "Updated Branch Name",
        address: "Updated Address",
        contactNumber: "0123456789",
      };

      const error = new Error("Update failed");
      mockAxios.patch.mockRejectedValue(error);

      await expect(updateBranch(branchUpdate)).rejects.toThrow("Update failed");
    });
  });

  describe("updateSessions", () => {
    it("should update branch sessions successfully", async () => {
      const branchId = "1";
      const sessions = ["session1", "session2"];

      const mockResponse = {
        data: {
          message: "Sessions updated successfully",
        },
      };

      mockAxios.patch.mockResolvedValue(mockResponse);

      const result = await updateSessions(branchId, sessions);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/branch/update-sessions/${branchId}`,
        { sessions },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle session update errors", async () => {
      const branchId = "1";
      const sessions = ["session1"];

      const error = new Error("Session update failed");
      mockAxios.patch.mockRejectedValue(error);

      await expect(updateSessions(branchId, sessions)).rejects.toThrow(
        "Session update failed",
      );
    });
  });

  describe("updateAdmins", () => {
    it("should update branch admins successfully", async () => {
      const branchId = "1";
      const clerkIds = ["clerk1", "clerk2"];

      const mockResponse = {
        data: {
          message: "Admins updated successfully",
        },
      };

      mockAxios.patch.mockResolvedValue(mockResponse);

      const result = await updateAdmins(branchId, clerkIds);

      expect(mockAxios.patch).toHaveBeenCalledWith(
        `/branch/update-admins/${branchId}`,
        { clerkIds },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle admin update errors", async () => {
      const branchId = "1";
      const clerkIds = ["clerk1"];

      const error = new Error("Admin update failed");
      mockAxios.patch.mockRejectedValue(error);

      await expect(updateAdmins(branchId, clerkIds)).rejects.toThrow(
        "Admin update failed",
      );
    });
  });

  describe("getUserBranches", () => {
    it("should fetch user branches successfully", async () => {
      const mockResponse = {
        data: {
          data: {
            content: [
              {
                id: "1",
                name: "User Branch 1",
                address: "User Address 1",
                contactNumber: "0123456789",
                rooms: 5,
                status: "ACTIVE",
                sessions: [],
              },
            ],
          },
        },
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await getUserBranches();

      expect(mockAxios.get).toHaveBeenCalledWith("/branch/user-branches", {
        params: {
          page: 0,
          limit: 100,
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Fetch failed");
      mockAxios.get.mockRejectedValue(error);

      await expect(getUserBranches()).rejects.toThrow("Fetch failed");
    });
  });
});
