import { Branch, BranchData } from "@/app/types/branch";
import { Session } from "@/app/types/session";

describe("Branch Types", () => {
  describe("Branch type", () => {
    it("should have correct structure", () => {
      const mockBranch: Branch = {
        id: "1",
        name: "Test Branch",
        address: "123 Test Street",
        contactNumber: "0123456789",
        rooms: 10,
        status: "ACTIVE",
        sessions: [],
      };

      expect(mockBranch).toHaveProperty("id");
      expect(mockBranch).toHaveProperty("name");
      expect(mockBranch).toHaveProperty("address");
      expect(mockBranch).toHaveProperty("contactNumber");
      expect(mockBranch).toHaveProperty("rooms");
      expect(mockBranch).toHaveProperty("status");
      expect(mockBranch).toHaveProperty("sessions");

      expect(typeof mockBranch.id).toBe("string");
      expect(typeof mockBranch.name).toBe("string");
      expect(typeof mockBranch.address).toBe("string");
      expect(typeof mockBranch.contactNumber).toBe("string");
      expect(typeof mockBranch.rooms).toBe("number");
      expect(typeof mockBranch.status).toBe("string");
      expect(Array.isArray(mockBranch.sessions)).toBe(true);
    });

    it("should accept ACTIVE status", () => {
      const branch: Branch = {
        id: "1",
        name: "Active Branch",
        address: "123 Test Street",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: [],
      };

      expect(branch.status).toBe("ACTIVE");
    });

    it("should accept INACTIVE status", () => {
      const branch: Branch = {
        id: "1",
        name: "Inactive Branch",
        address: "123 Test Street",
        contactNumber: "0123456789",
        rooms: 5,
        status: "INACTIVE",
        sessions: [],
      };

      expect(branch.status).toBe("INACTIVE");
    });

    it("should handle sessions array", () => {
      const mockSessions: Session[] = [
        {
          id: "1",
          name: "Morning Session",
          startTime: "08:00",
          endTime: "10:00",
        },
        {
          id: "2",
          name: "Afternoon Session",
          startTime: "14:00",
          endTime: "16:00",
        },
      ];

      const branch: Branch = {
        id: "1",
        name: "Branch with Sessions",
        address: "123 Test Street",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: mockSessions,
      };

      expect(branch.sessions).toHaveLength(2);
      expect(branch.sessions[0].name).toBe("Morning Session");
      expect(branch.sessions[1].name).toBe("Afternoon Session");
    });

    it("should handle empty sessions array", () => {
      const branch: Branch = {
        id: "1",
        name: "Branch without Sessions",
        address: "123 Test Street",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: [],
      };

      expect(branch.sessions).toHaveLength(0);
    });
  });

  describe("BranchData type", () => {
    it("should have correct pagination structure", () => {
      const mockBranchData: BranchData = {
        content: [
          {
            id: "1",
            name: "Branch 1",
            address: "Address 1",
            contactNumber: "0123456789",
            rooms: 5,
            status: "ACTIVE",
            sessions: [],
          },
          {
            id: "2",
            name: "Branch 2",
            address: "Address 2",
            contactNumber: "0987654321",
            rooms: 10,
            status: "INACTIVE",
            sessions: [],
          },
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
      };

      expect(mockBranchData).toHaveProperty("content");
      expect(mockBranchData).toHaveProperty("pageNumber");
      expect(mockBranchData).toHaveProperty("pageSize");
      expect(mockBranchData).toHaveProperty("totalElements");
      expect(mockBranchData).toHaveProperty("totalPages");

      expect(Array.isArray(mockBranchData.content)).toBe(true);
      expect(typeof mockBranchData.pageNumber).toBe("number");
      expect(typeof mockBranchData.pageSize).toBe("number");
      expect(typeof mockBranchData.totalElements).toBe("number");
      expect(typeof mockBranchData.totalPages).toBe("number");
    });

    it("should handle empty content array", () => {
      const emptyBranchData: BranchData = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      };

      expect(emptyBranchData.content).toHaveLength(0);
      expect(emptyBranchData.totalElements).toBe(0);
      expect(emptyBranchData.totalPages).toBe(0);
    });

    it("should handle pagination with multiple pages", () => {
      const paginatedBranchData: BranchData = {
        content: [
          {
            id: "1",
            name: "Branch 1",
            address: "Address 1",
            contactNumber: "0123456789",
            rooms: 5,
            status: "ACTIVE",
            sessions: [],
          },
        ],
        pageNumber: 1,
        pageSize: 5,
        totalElements: 25,
        totalPages: 5,
      };

      expect(paginatedBranchData.pageNumber).toBe(1);
      expect(paginatedBranchData.pageSize).toBe(5);
      expect(paginatedBranchData.totalElements).toBe(25);
      expect(paginatedBranchData.totalPages).toBe(5);
    });
  });

  describe("Branch validation", () => {
    it("should validate required fields", () => {
      const validBranch: Branch = {
        id: "1",
        name: "Valid Branch",
        address: "Valid Address",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: [],
      };

      expect(validBranch.id).toBeTruthy();
      expect(validBranch.name).toBeTruthy();
      expect(validBranch.address).toBeTruthy();
      expect(validBranch.contactNumber).toBeTruthy();
      expect(validBranch.rooms).toBeGreaterThan(0);
      expect(["ACTIVE", "INACTIVE"]).toContain(validBranch.status);
    });

    it("should validate phone number format", () => {
      const branchWithValidPhone: Branch = {
        id: "1",
        name: "Branch",
        address: "Address",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: [],
      };

      // Phone number should be numeric and have reasonable length
      expect(/^\d+$/.test(branchWithValidPhone.contactNumber)).toBe(true);
      expect(branchWithValidPhone.contactNumber.length).toBeGreaterThanOrEqual(
        9,
      );
      expect(branchWithValidPhone.contactNumber.length).toBeLessThanOrEqual(12);
    });

    it("should validate rooms count", () => {
      const branchWithValidRooms: Branch = {
        id: "1",
        name: "Branch",
        address: "Address",
        contactNumber: "0123456789",
        rooms: 5,
        status: "ACTIVE",
        sessions: [],
      };

      expect(branchWithValidRooms.rooms).toBeGreaterThan(0);
      expect(Number.isInteger(branchWithValidRooms.rooms)).toBe(true);
    });
  });

  describe("BranchData validation", () => {
    it("should validate pagination consistency", () => {
      const validBranchData: BranchData = {
        content: [
          {
            id: "1",
            name: "Branch 1",
            address: "Address 1",
            contactNumber: "0123456789",
            rooms: 5,
            status: "ACTIVE",
            sessions: [],
          },
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      };

      expect(validBranchData.content.length).toBeLessThanOrEqual(
        validBranchData.pageSize,
      );
      expect(validBranchData.totalElements).toBeGreaterThanOrEqual(
        validBranchData.content.length,
      );
      expect(validBranchData.totalPages).toBeGreaterThan(0);
      expect(validBranchData.pageNumber).toBeGreaterThanOrEqual(0);
      expect(validBranchData.pageNumber).toBeLessThan(
        validBranchData.totalPages,
      );
    });

    it("should handle edge cases", () => {
      // Empty result set
      const emptyData: BranchData = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      };

      expect(emptyData.content.length).toBe(0);
      expect(emptyData.totalElements).toBe(0);
      expect(emptyData.totalPages).toBe(0);

      // Single page with full content
      const fullPageData: BranchData = {
        content: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Branch ${i + 1}`,
          address: `Address ${i + 1}`,
          contactNumber: "0123456789",
          rooms: 5,
          status: "ACTIVE" as const,
          sessions: [],
        })),
        pageNumber: 0,
        pageSize: 10,
        totalElements: 10,
        totalPages: 1,
      };

      expect(fullPageData.content.length).toBe(fullPageData.pageSize);
      expect(fullPageData.totalElements).toBe(fullPageData.content.length);
      expect(fullPageData.totalPages).toBe(1);
    });
  });
});
