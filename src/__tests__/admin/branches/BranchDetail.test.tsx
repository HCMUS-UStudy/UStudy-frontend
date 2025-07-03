import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import BranchDetail from "@/app/(admin)/admin/branches/[branchID]/page";
import {
  getAllBranches,
  getListClerk,
  getAvailableClerks,
  updateBranch,
  updateAdmins,
  updateSessions,
} from "@/app/lib/services/branch";
import { getSession } from "@/app/lib/services/session";
import { setBranches, setSelectedBranch } from "@/app/store/branch-slice";
import "@testing-library/jest-dom";

// Mock the services
jest.mock("@/app/lib/services/branch");
jest.mock("@/app/lib/services/session");
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ branchID: "MQ==" }),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock the components
jest.mock("@/app/ui/components/_common/text-field/Input", () => ({
  __esModule: true,
  Input: jest.fn(({ value, onChange, ...props }) => (
    <input value={value} onChange={onChange} {...props} />
  )),
}));

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => ({
  __esModule: true,
  default: jest.fn(({ placeholder }) => <input placeholder={placeholder} />),
}));

jest.mock("@/app/ui/components/admin/branches/ClerkModal", () => ({
  __esModule: true,
  default: jest.fn(({ setShowClerkModal }) => (
    <div data-testid="clerk-modal">
      <button onClick={() => setShowClerkModal(false)}>
        Close Clerk Modal
      </button>
    </div>
  )),
}));

jest.mock("@/app/ui/components/admin/branches/EditSessionModal", () => ({
  __esModule: true,
  default: jest.fn(({ setShowSessionModal }) => (
    <div data-testid="session-modal">
      <button onClick={() => setShowSessionModal(false)}>
        Close Session Modal
      </button>
    </div>
  )),
}));

// Mock icons
jest.mock("react-icons/io5", () => ({
  __esModule: true,
  IoChevronBackOutline: () => <span data-testid="back-icon">Back</span>,
}));

jest.mock("react-icons/fa", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FaEdit: ({ onClick }: any) => (
    <button onClick={onClick} data-testid="edit-icon">
      Edit
    </button>
  ),
  FaTrashAlt: () => <span data-testid="delete-icon">Delete</span>,
}));

jest.mock("react-icons/fi", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FiCheck: ({ onClick }: any) => (
    <button onClick={onClick} data-testid="check-icon">
      ✓
    </button>
  ),
}));

jest.mock("react-icons/rx", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RxCross2: ({ onClick }: any) => (
    <button onClick={onClick} data-testid="cross-icon">
      ✗
    </button>
  ),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock data
const mockBranch = {
  id: "1",
  name: "Chi nhánh Hà Nội",
  address: "123 Đường ABC, Hà Nội",
  contactNumber: "0123456789",
  rooms: 10,
  status: "ACTIVE" as const,
  sessions: [
    {
      id: "1",
      name: "Ca sáng",
      startTime: "08:00",
      endTime: "10:00",
    },
  ],
};

const mockBranches = [mockBranch];

const mockClerks = [
  {
    id: "clerk1",
    genId: "GV001",
    name: "Clerk 1",
    email: "clerk1@example.com",
    avatar: "",
    gender: "Male",
  },
  {
    id: "clerk2",
    genId: "GV002",
    name: "Clerk 2",
    email: "clerk2@example.com",
    avatar: "",
    gender: "Female",
  },
];

const mockSessions = [
  {
    id: "1",
    name: "Ca sáng",
    startTime: "08:00",
    endTime: "10:00",
  },
  {
    id: "2",
    name: "Ca chiều",
    startTime: "14:00",
    endTime: "16:00",
  },
];

// Create mock store
const createMockStore = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: { branches: any[]; selectedBranch: string | null } = {
    branches: [mockBranch],
    selectedBranch: "1",
  },
) =>
  configureStore({
    reducer: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branch: (state = initialState, action: any) => {
        if (action.type === setBranches.type) {
          return { ...state, branches: action.payload };
        }
        if (action.type === setSelectedBranch.type) {
          return { ...state, selectedBranch: action.payload };
        }
        return state;
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

const renderBranchDetail = () => {
  const store = createMockStore();
  const queryClient = createMockQueryClient();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BranchDetail />
      </QueryClientProvider>
    </Provider>,
  );
};

describe("BranchDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllBranches as jest.Mock).mockResolvedValue({ content: mockBranches });
    (getListClerk as jest.Mock).mockResolvedValue({
      data: { content: mockClerks },
    });
    (getAvailableClerks as jest.Mock).mockResolvedValue({ data: mockClerks });
    (getSession as jest.Mock).mockResolvedValue({ content: mockSessions });
    (updateBranch as jest.Mock).mockResolvedValue({ message: "Success" });
    (updateAdmins as jest.Mock).mockResolvedValue({ message: "Success" });
    (updateSessions as jest.Mock).mockResolvedValue({ message: "Success" });
  });

  it("renders branch details", async () => {
    renderBranchDetail();

    await waitFor(() => {
      expect(screen.getByText("Chi nhánh Hà Nội")).toBeInTheDocument();
    });

    expect(screen.getByText("123 Đường ABC, Hà Nội")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("displays branch sessions", async () => {
    renderBranchDetail();

    await waitFor(() => {
      expect(screen.getByText("Ca sáng: 08:00 - 10:00")).toBeInTheDocument();
    });
  });

  it("displays branch clerks", async () => {
    renderBranchDetail();

    await waitFor(() => {
      expect(screen.getByText("GV001 - Clerk 1")).toBeInTheDocument();
      expect(screen.getByText("GV002 - Clerk 2")).toBeInTheDocument();
    });
  });

  it("shows edit mode for address", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[0]); // First edit button is for address
    expect(
      screen.getByDisplayValue("123 Đường ABC, Hà Nội"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
  });

  it("shows edit mode for contact number", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[1]); // Second edit button is for contact number
    expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
  });

  it("saves address changes", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[0]);
    const addressInput = screen.getByDisplayValue("123 Đường ABC, Hà Nội");
    fireEvent.change(addressInput, { target: { value: "New Address" } });
    const checkButton = screen.getByTestId("check-icon");
    fireEvent.click(checkButton);
    await waitFor(() => {
      expect(updateBranch).toHaveBeenCalledWith({
        id: "1",
        name: "Chi nhánh Hà Nội",
        address: "New Address",
        contactNumber: "0123456789",
      });
    });
  });

  it("cancels address changes", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[0]);
    const addressInput = screen.getByDisplayValue("123 Đường ABC, Hà Nội");
    fireEvent.change(addressInput, { target: { value: "New Address" } });
    const crossButton = screen.getByTestId("cross-icon");
    fireEvent.click(crossButton);
    expect(screen.getByText("123 Đường ABC, Hà Nội")).toBeInTheDocument();
  });

  it("opens clerk modal when edit clerks button is clicked", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[3]); // Fourth edit button is for clerks
    expect(await screen.findByTestId("clerk-modal")).toBeInTheDocument();
  });

  it("opens session modal when edit sessions button is clicked", async () => {
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[2]); // Third edit button is for sessions
    expect(await screen.findByTestId("session-modal")).toBeInTheDocument();
  });

  it("handles back navigation", async () => {
    const mockRouter = { push: jest.fn() };
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue(mockRouter);

    renderBranchDetail();

    await waitFor(() => {
      const backButton = screen.getByTestId("back-icon");
      fireEvent.click(backButton);
    });

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/admin/branches");
      },
      { timeout: 1000 },
    );
  });

  it("handles update branch error", async () => {
    (updateBranch as jest.Mock).mockRejectedValue(new Error("Update failed"));
    renderBranchDetail();
    const editButtons = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editButtons[0]);
    const checkButton = screen.getByTestId("check-icon");
    fireEvent.click(checkButton);
    await waitFor(() => {
      expect(updateBranch).toHaveBeenCalled();
    });
  });

  it("handles empty sessions list", async () => {
    const branchWithoutSessions = { ...mockBranch, sessions: [] };
    (getAllBranches as jest.Mock).mockResolvedValue({
      content: [branchWithoutSessions],
    });
    const store = createMockStore({
      branches: [branchWithoutSessions],
      selectedBranch: "1",
    });
    const queryClient = createMockQueryClient();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BranchDetail />
        </QueryClientProvider>
      </Provider>,
    );
    expect(await screen.findByText("Chưa có ca học")).toBeInTheDocument();
  });

  it("handles empty clerks list", async () => {
    (getListClerk as jest.Mock).mockResolvedValue({ data: { content: [] } });
    const store = createMockStore();
    const queryClient = createMockQueryClient();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BranchDetail />
        </QueryClientProvider>
      </Provider>,
    );
    expect(await screen.findByText("Chưa có giáo vụ")).toBeInTheDocument();
  });

  it("fetches branches when not available in store", async () => {
    const store = createMockStore({ branches: [], selectedBranch: null });
    const queryClient = createMockQueryClient();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BranchDetail />
        </QueryClientProvider>
      </Provider>,
    );
    await waitFor(() => {
      expect(getAllBranches).toHaveBeenCalledWith(0, 100);
    });
  });

  it("dispatches branches to store", async () => {
    const store = createMockStore();
    const queryClient = createMockQueryClient();

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BranchDetail />
        </QueryClientProvider>
      </Provider>,
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.branch.branches).toEqual(mockBranches);
    });
  });
});
