import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RoomsAdminPage from "@/app/ui/components/admin/rooms/RoomsAdminPage";
import {
  getBranchRooms,
  updateRoom,
  deleteRoom,
} from "@/app/lib/services/room";
import branchReducer from "@/app/store/branch-slice";
import "@testing-library/jest-dom";

// Mock the services
jest.mock("@/app/lib/services/room");
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }),
}));

const mockGetBranchRooms = getBranchRooms as jest.MockedFunction<
  typeof getBranchRooms
>;
const mockUpdateRoom = updateRoom as jest.MockedFunction<typeof updateRoom>;
const mockDeleteRoom = deleteRoom as jest.MockedFunction<typeof deleteRoom>;

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
    pageSize: 10,
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

describe("RoomsAdminPage", () => {
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
          <RoomsAdminPage searchQuery={searchQuery} />
        </QueryClientProvider>
      </Provider>,
    );
  };

  describe("Data Fetching", () => {
    it("fetches rooms when component mounts", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockGetBranchRooms).toHaveBeenCalledWith("branch-1", 0, 10);
      });
    });

    it("shows loading state while fetching data", () => {
      mockGetBranchRooms.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders();

      expect(screen.getByText("Tên phòng")).toBeInTheDocument();
      expect(screen.getByText("Sức chứa")).toBeInTheDocument();
      expect(screen.getByText("Hành động")).toBeInTheDocument();
    });

    it("shows error message when API call fails", async () => {
      const errorMessage = "Failed to fetch rooms";
      mockGetBranchRooms.mockRejectedValue(new Error(errorMessage));
      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("shows no branch selected message when no branch is selected", () => {
      mockStore = createMockStore(""); // No branch selected
      renderWithProviders();

      expect(
        screen.getByText("Vui lòng chọn chi nhánh để xem danh sách phòng học."),
      ).toBeInTheDocument();
    });
  });

  describe("Room Display", () => {
    it("displays all rooms in the table", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Phòng A101")).toBeInTheDocument();
        expect(screen.getByText("Phòng A102")).toBeInTheDocument();
        expect(screen.getByText("Phòng B201")).toBeInTheDocument();
      });
    });

    it("displays room capacity correctly", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("30 học sinh")).toBeInTheDocument();
        expect(screen.getByText("25 học sinh")).toBeInTheDocument();
        expect(screen.getByText("40 học sinh")).toBeInTheDocument();
      });
    });

    it("shows default capacity when room has no capacity", async () => {
      const roomsWithoutCapacity = [{ ...mockRooms[0], capacity: undefined }];
      mockGetBranchRooms.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: {
          ...mockRoomsResponse.data,
          content: roomsWithoutCapacity,
        },
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("30 học sinh")).toBeInTheDocument(); // Default capacity
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters rooms by name", async () => {
      renderWithProviders("A101");

      await waitFor(() => {
        expect(screen.getByText("Phòng A101")).toBeInTheDocument();
        expect(screen.queryByText("Phòng A102")).not.toBeInTheDocument();
        expect(screen.queryByText("Phòng B201")).not.toBeInTheDocument();
      });
    });

    it("filters rooms by ID", async () => {
      renderWithProviders("room-1");

      await waitFor(() => {
        expect(screen.getByText("Phòng A101")).toBeInTheDocument();
        expect(screen.queryByText("Phòng A102")).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search has no matches", async () => {
      renderWithProviders("nonexistent");

      await waitFor(() => {
        expect(
          screen.getByText("Không tìm thấy phòng học phù hợp."),
        ).toBeInTheDocument();
      });
    });

    it("shows empty state when no rooms exist", async () => {
      mockGetBranchRooms.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: {
          ...mockRoomsResponse.data,
          content: [],
        },
      });

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("Không có phòng học nào.")).toBeInTheDocument();
      });
    });
  });

  describe("Edit Room", () => {
    it("opens edit modal when edit button is clicked", async () => {
      renderWithProviders();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("edit-room-button");
        fireEvent.click(editButtons[0]);
      });

      expect(
        screen.getByRole("heading", { name: "Chỉnh sửa phòng học" }),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("Phòng A101")).toBeInTheDocument();
      expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    });

    it("updates room successfully", async () => {
      mockUpdateRoom.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101 Updated", capacity: 35 },
      });

      renderWithProviders();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("edit-room-button");
        fireEvent.click(editButtons[0]);
      });

      const nameInput = screen.getByDisplayValue("Phòng A101");
      const capacityInput = screen.getByDisplayValue("30");

      fireEvent.change(nameInput, { target: { value: "Phòng A101 Updated" } });
      fireEvent.change(capacityInput, { target: { value: "35" } });

      const updateButton = screen.getByText("Cập nhật");
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith("room-1", {
          name: "Phòng A101 Updated",
          capacity: 35,
        });
      });
    });

    it("shows error when update fails", async () => {
      mockUpdateRoom.mockRejectedValue(new Error("Update failed"));

      renderWithProviders();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("edit-room-button");
        fireEvent.click(editButtons[0]);
      });

      const updateButton = screen.getByText("Cập nhật");
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalled();
      });
    });

    it("closes edit modal when cancel is clicked", async () => {
      renderWithProviders();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("edit-room-button");
        fireEvent.click(editButtons[0]);
      });

      const cancelButton = screen.getByText("Hủy");
      fireEvent.click(cancelButton);

      expect(
        screen.queryByRole("heading", { name: "Chỉnh sửa phòng học" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Delete Room", () => {
    it("shows delete confirmation dialog when delete button is clicked", async () => {
      renderWithProviders();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-room-button");
        fireEvent.click(deleteButtons[0]);
      });

      expect(screen.getByText("Xác nhận xóa phòng học")).toBeInTheDocument();
      expect(
        screen.getByText("Bạn có chắc chắn muốn xóa phòng học này không?"),
      ).toBeInTheDocument();
    });

    it("deletes room successfully", async () => {
      mockDeleteRoom.mockResolvedValue({
        message: "Success",
        statusCode: "200",
        data: { id: "room-1", name: "Phòng A101", capacity: 30 },
      });

      renderWithProviders();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-room-button");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmDeleteButton = screen.getByText("Xóa");
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockDeleteRoom).toHaveBeenCalledWith("room-1");
      });
    });

    it("cancels delete when cancel button is clicked", async () => {
      renderWithProviders();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-room-button");
        fireEvent.click(deleteButtons[0]);
      });

      const cancelButton = screen.getByText("Hủy");
      fireEvent.click(cancelButton);

      expect(
        screen.queryByText("Xác nhận xóa phòng học"),
      ).not.toBeInTheDocument();
    });

    it("shows error when delete fails", async () => {
      mockDeleteRoom.mockRejectedValue(new Error("Delete failed"));

      renderWithProviders();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-room-button");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmDeleteButton = screen.getByText("Xóa");
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockDeleteRoom).toHaveBeenCalled();
      });
    });
  });

  describe("Pagination", () => {
    it("displays pagination when there are multiple pages", async () => {
      const paginatedResponse = {
        message: "Success",
        statusCode: "200",
        data: {
          ...mockRoomsResponse.data,
          totalPages: 3,
          totalElements: 25,
        },
      };
      mockGetBranchRooms.mockResolvedValue(paginatedResponse);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
      });
    });

    it("changes page when pagination is clicked", async () => {
      const paginatedResponse = {
        message: "Success",
        statusCode: "200",
        data: {
          ...mockRoomsResponse.data,
          totalPages: 2,
          totalElements: 15,
        },
      };
      mockGetBranchRooms.mockResolvedValue(paginatedResponse);

      renderWithProviders();

      await waitFor(() => {
        const page2Button = screen.getByText("2");
        fireEvent.click(page2Button);
      });

      await waitFor(() => {
        expect(mockGetBranchRooms).toHaveBeenCalledWith("branch-1", 1, 10);
      });
    });
  });
});
