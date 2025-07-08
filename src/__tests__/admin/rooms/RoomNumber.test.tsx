import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RoomNumber from "@/app/ui/components/admin/rooms/RoomNumber";
import { getBranchRooms } from "@/app/lib/services/room";
import branchReducer from "@/app/store/branch-slice";
import "@testing-library/jest-dom";

// Mock the services
jest.mock("@/app/lib/services/room");

const mockGetBranchRooms = getBranchRooms as jest.MockedFunction<
  typeof getBranchRooms
>;

// Mock data
const mockRooms = [
  {
    id: "room-1",
    name: "Phòng A101",
    capacity: 30,
  },
  {
    id: "room-2",
    name: "Phòng A102",
    capacity: 25,
  },
  {
    id: "room-3",
    name: "Phòng B201",
    capacity: 40,
  },
];

const mockRoomsResponse = {
  message: "Success",
  statusCode: "200",
  data: {
    content: mockRooms,
    pageNumber: 0,
    pageSize: 10000,
    totalElements: 3,
    totalPages: 1,
    last: true,
  },
};

// Create mock store
const createMockStore = (selectedBranchId: string = "branch-1") =>
  configureStore({
    reducer: {
      branch: branchReducer,
    },
    preloadedState: {
      branch: {
        selectedBranchId,
        branches: [
          {
            id: "branch-1",
            name: "Chi nhánh 1",
            address: "123 Đường ABC",
            contactNumber: "0123456789",
            rooms: 10,
            status: "ACTIVE" as const,
            sessions: [],
          },
          {
            id: "branch-2",
            name: "Chi nhánh 2",
            address: "456 Đường XYZ",
            contactNumber: "0987654321",
            rooms: 8,
            status: "ACTIVE" as const,
            sessions: [],
          },
        ],
      },
    },
  });

// Create mock query client
const createMockQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("RoomNumber", () => {
  let mockStore: ReturnType<typeof createMockStore>;
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore();
    mockQueryClient = createMockQueryClient();
    mockGetBranchRooms.mockResolvedValue(mockRoomsResponse);
  });

  const renderWithProviders = (searchQuery: string = "") => {
    return render(
      <Provider store={mockStore}>
        <QueryClientProvider client={mockQueryClient}>
          <RoomNumber searchQuery={searchQuery} />
        </QueryClientProvider>
      </Provider>,
    );
  };

  describe("Room Count Display", () => {
    it("displays total room count when no search query", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (3)")).toBeInTheDocument();
      });
    });

    it("displays filtered room count when search query is provided", async () => {
      renderWithProviders("A101");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (1)")).toBeInTheDocument();
      });
    });

    it("displays zero count when search has no matches", async () => {
      renderWithProviders("nonexistent");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (0)")).toBeInTheDocument();
      });
    });

    it("shows loading state while fetching data", () => {
      mockGetBranchRooms.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders();

      expect(
        screen.getByText("Tổng số phòng học (Đang tải...)"),
      ).toBeInTheDocument();
    });

    it("formats large numbers with Vietnamese locale", async () => {
      const manyRooms = Array.from({ length: 1234 }, (_, i) => ({
        id: `room-${i}`,
        name: `Phòng ${i}`,
        capacity: 30,
      }));

      mockGetBranchRooms.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: {
          content: manyRooms,
          pageNumber: 0,
          pageSize: 10000,
          totalElements: 1234,
          totalPages: 1,
          last: true,
        },
      });

      renderWithProviders();

      await waitFor(() => {
        expect(
          screen.getByText("Tổng số phòng học (1.234)"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters rooms by name", async () => {
      renderWithProviders("A101");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (1)")).toBeInTheDocument();
      });
    });

    it("filters rooms by ID", async () => {
      renderWithProviders("room-1");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (1)")).toBeInTheDocument();
      });
    });

    it("filters rooms case-insensitively", async () => {
      renderWithProviders("a101");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (1)")).toBeInTheDocument();
      });
    });

    it("filters rooms by partial name match", async () => {
      renderWithProviders("A1");

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (2)")).toBeInTheDocument();
      });
    });
  });

  describe("API Integration", () => {
    it("fetches rooms for the selected branch", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockGetBranchRooms).toHaveBeenCalledWith("branch-1", 0, 10000);
      });
    });

    it("does not fetch when no branch is selected", () => {
      mockStore = createMockStore(""); // No branch selected
      renderWithProviders();

      expect(mockGetBranchRooms).not.toHaveBeenCalled();
    });

    it("handles API errors gracefully", async () => {
      mockGetBranchRooms.mockRejectedValue(new Error("API Error"));
      renderWithProviders();

      // Should still render the component with loading state
      const heading = screen.getByRole("heading", {
        name: /Tổng số phòng học/,
      });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("UI States", () => {
    it("applies loading animation class when fetching", () => {
      mockGetBranchRooms.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders();

      const heading = screen.getByRole("heading", {
        name: /Tổng số phòng học/,
      });
      expect(heading).toHaveClass("animate-pulse", "text-gray-400");
    });

    it("removes loading animation when data is loaded", async () => {
      renderWithProviders();

      await waitFor(() => {
        const heading = screen.getByRole("heading", {
          name: /Tổng số phòng học/,
        });
        expect(heading).not.toHaveClass("animate-pulse", "text-gray-400");
      });
    });

    it("has correct heading structure", async () => {
      renderWithProviders();

      const heading = screen.getByRole("heading", {
        name: /Tổng số phòng học/,
      });
      expect(heading.tagName).toBe("H2");
      expect(heading).toHaveClass("text-lg", "md:text-2xl", "font-bold");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty room list", async () => {
      mockGetBranchRooms.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: {
          content: [],
          pageNumber: 0,
          pageSize: 10000,
          totalElements: 0,
          totalPages: 0,
          last: true,
        },
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (0)")).toBeInTheDocument();
      });
    });

    it("handles rooms with undefined capacity", async () => {
      const roomsWithoutCapacity = [{ ...mockRooms[0], capacity: undefined }];

      mockGetBranchRooms.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: {
          content: roomsWithoutCapacity,
          pageNumber: 0,
          pageSize: 10000,
          totalElements: 1,
          totalPages: 1,
          last: true,
        },
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Tổng số phòng học (1)")).toBeInTheDocument();
      });
    });
  });
});
