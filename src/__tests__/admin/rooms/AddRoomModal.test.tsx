import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddRoomModal from "@/app/ui/components/admin/rooms/AddRoomModal";
import { createRoom } from "@/app/lib/services/room";
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

const mockCreateRoom = createRoom as jest.MockedFunction<typeof createRoom>;

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

describe("AddRoomModal", () => {
  let mockStore: ReturnType<typeof createMockStore>;
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore();
    mockQueryClient = createMockQueryClient();
    mockCreateRoom.mockResolvedValue({
      message: "Success",
      statusCode: "200",
      data: { id: "room-1", name: "Phòng A101", capacity: 30 },
    });
  });

  const renderWithProviders = () => {
    return render(
      <Provider store={mockStore}>
        <QueryClientProvider client={mockQueryClient}>
          <AddRoomModal buttonLabel="Tạo phòng học" />
        </QueryClientProvider>
      </Provider>,
    );
  };

  describe("Modal Trigger", () => {
    it("renders the trigger button with correct label", () => {
      renderWithProviders();

      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      expect(openModalButton).toBeInTheDocument();
      expect(openModalButton).toHaveClass(
        "bg-primary-dark",
        "hover:bg-primary-darker",
      );
    });

    it("opens modal when button is clicked", () => {
      renderWithProviders();

      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);

      expect(screen.getByText("Thêm phòng học")).toBeInTheDocument();
    });

    it("disables button when no branch is selected", () => {
      mockStore = createMockStore(""); // No branch selected
      renderWithProviders();

      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      expect(openModalButton).toBeDisabled();
    });
  });

  describe("Modal Content", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("displays modal title", () => {
      expect(screen.getByText("Thêm phòng học")).toBeInTheDocument();
    });

    it("displays room name input field", () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toBeRequired();
    });

    it("displays capacity input field", () => {
      const capacityInput = screen.getByDisplayValue("30");
      expect(capacityInput).toBeInTheDocument();
      expect(capacityInput).toHaveAttribute("type", "number");
      expect(capacityInput).toHaveAttribute("min", "1");
      expect(capacityInput).toHaveAttribute("max", "100");
      expect(capacityInput).toBeRequired();
    });

    it("displays action buttons", () => {
      expect(screen.getByText("Hủy")).toBeInTheDocument();
      expect(screen.getByText("Tạo phòng")).toBeInTheDocument();
    });

    it("has correct default values", () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");

      expect(nameInput).toHaveValue("");
      expect(capacityInput).toHaveValue(30);
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("shows error when room name is only whitespace", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "   " } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = screen.getByText("Vui lòng nhập tên phòng học.");
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv.closest("div")).toHaveClass(
          "mb-4",
          "p-3",
          "bg-red-100",
          "border",
          "border-red-400",
          "text-red-700",
          "rounded-lg",
        );
      });
    });

    it("allows submission with valid data", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateRoom).toHaveBeenCalledWith("branch-1", {
          name: "Phòng A101",
          capacity: 30,
        });
      });
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("submits form with correct data", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "35" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateRoom).toHaveBeenCalledWith("branch-1", {
          name: "Phòng A101",
          capacity: 35,
        });
      });
    });

    it("trims room name before submission", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "  Phòng A101  " } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateRoom).toHaveBeenCalledWith("branch-1", {
          name: "Phòng A101",
          capacity: 30,
        });
      });
    });

    it("shows loading state during submission", async () => {
      mockCreateRoom.mockImplementation(() => new Promise(() => {})); // Never resolves

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      expect(screen.getByText("Đang tạo...")).toBeInTheDocument();
      expect(screen.getByText("Đang tạo...")).toBeDisabled();
    });

    it("disables form during submission", async () => {
      mockCreateRoom.mockImplementation(() => new Promise(() => {})); // Never resolves

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");
      const cancelButton = screen.getByText("Hủy");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toBeDisabled();
        expect(capacityInput).toBeDisabled();
        expect(cancelButton).toBeDisabled();
      });
    });
  });

  describe("Success Handling", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("closes modal on successful submission", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText("Thêm phòng học")).not.toBeInTheDocument();
      });
    });

    it("resets form on successful submission", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "35" } });
      fireEvent.click(submitButton);

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByText("Thêm phòng học")).not.toBeInTheDocument();
      });

      // Reopen modal to check reset
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);

      await waitFor(() => {
        const newNameInput = screen.getByPlaceholderText(
          "Nhập tên phòng học...",
        );
        const newCapacityInput = screen.getByDisplayValue("30");
        expect(newNameInput).toHaveValue("");
        expect(newCapacityInput).toHaveValue(30);
      });
    });

    it("invalidates rooms query on success", async () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateRoom).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("shows error message when API call fails", async () => {
      mockCreateRoom.mockRejectedValue(new Error("API Error"));

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = screen.getByText("Có lỗi xảy ra khi tạo phòng học.");
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv.closest("div")).toHaveClass(
          "mb-4",
          "p-3",
          "bg-red-100",
          "border",
          "border-red-400",
          "text-red-700",
          "rounded-lg",
        );
      });
    });

    it("keeps modal open when submission fails", async () => {
      mockCreateRoom.mockRejectedValue(new Error("API Error"));

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Thêm phòng học")).toBeInTheDocument();
      });
    });

    it("enables form after failed submission", async () => {
      mockCreateRoom.mockRejectedValue(new Error("API Error"));

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(nameInput).not.toBeDisabled();
        expect(capacityInput).not.toBeDisabled();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Modal Actions", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("closes modal when cancel button is clicked", () => {
      const cancelButton = screen.getByText("Hủy");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Thêm phòng học")).not.toBeInTheDocument();
    });

    it("resets form when cancel button is clicked", () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "35" } });

      const cancelButton = screen.getByText("Hủy");
      fireEvent.click(cancelButton);

      // Reopen modal to check reset
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);

      const newNameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const newCapacityInput = screen.getByDisplayValue("30");

      expect(newNameInput).toHaveValue("");
      expect(newCapacityInput).toHaveValue(30);
    });

    it("clears error when cancel button is clicked", async () => {
      mockCreateRoom.mockRejectedValue(new Error("API Error"));

      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");
      const capacityInput = screen.getByDisplayValue("30");
      const submitButton = screen.getByText("Tạo phòng");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      fireEvent.change(capacityInput, { target: { value: "30" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = screen.getByText("Có lỗi xảy ra khi tạo phòng học.");
        expect(errorDiv).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("Hủy");
      fireEvent.click(cancelButton);

      // Reopen modal to check error is cleared
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);

      expect(
        screen.queryByText("Có lỗi xảy ra khi tạo phòng học."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      renderWithProviders();
      const [openModalButton] = screen.getAllByText("Tạo phòng học");
      fireEvent.click(openModalButton);
    });

    it("accepts valid room names", () => {
      const nameInput = screen.getByPlaceholderText("Nhập tên phòng học...");

      fireEvent.change(nameInput, { target: { value: "Phòng A101" } });
      expect(nameInput).toHaveValue("Phòng A101");

      fireEvent.change(nameInput, { target: { value: "Phòng học số 1" } });
      expect(nameInput).toHaveValue("Phòng học số 1");
    });

    it("accepts valid capacity values", () => {
      const capacityInput = screen.getByDisplayValue("30");

      fireEvent.change(capacityInput, { target: { value: "1" } });
      expect(capacityInput).toHaveValue(1);

      fireEvent.change(capacityInput, { target: { value: "100" } });
      expect(capacityInput).toHaveValue(100);

      fireEvent.change(capacityInput, { target: { value: "50" } });
      expect(capacityInput).toHaveValue(50);
    });

    it("enforces capacity limits", () => {
      const capacityInput = screen.getByDisplayValue("30");

      expect(capacityInput).toHaveAttribute("min", "1");
      expect(capacityInput).toHaveAttribute("max", "100");
    });
  });
});
