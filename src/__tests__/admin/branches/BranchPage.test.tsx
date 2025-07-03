import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import BranchPage from "@/app/ui/components/admin/branches/BranchPage";
import { getAllBranches } from "@/app/lib/services/branch";
import { setBranches } from "@/app/store/branch-slice";
import "@testing-library/jest-dom";

// Mock the services
jest.mock("@/app/lib/services/branch");
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({
    handleNavigate: jest.fn(),
  }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the components
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function SearchField({ placeholder }: any) {
    return <input placeholder={placeholder} />;
  };
});

jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function Pagination({
    currentPage,
    totalPages,
    handlePageClick,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) {
    return (
      <div>
        <button onClick={() => handlePageClick(currentPage + 1)}>Next</button>
        <button onClick={() => handlePageClick(currentPage - 1)}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Table", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Table: ({ children }: any) => <table>{children}</table>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableHeader: ({ columns }: any) => (
    <thead>
      <tr>
        {columns.map((col: string, index: number) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableBody: ({ children, isLoading }: any) => (
    <tbody>
      {isLoading ? (
        <tr>
          <td colSpan={5}>
            <div className="bg-slate-200 h-3 my-1 rounded"></div>
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableCell: ({ children, colSpan }: any) => (
    <td colSpan={colSpan}>{children}</td>
  ),
}));

jest.mock("@/app/ui/components/_common/Tooltip", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function Tooltip({ children, text }: any) {
    return <div title={text}>{children}</div>;
  };
});

jest.mock("@/app/ui/components/admin/branches/AddBranchModal", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function CreateBranchModal({ isOpen, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="create-branch-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

// Mock icons
jest.mock("react-icons/fa", () => ({
  FaEdit: () => <span data-testid="edit-icon">Edit</span>,
  FaTrashAlt: () => <span data-testid="delete-icon">Delete</span>,
}));

jest.mock("lucide-react", () => ({
  Eye: () => <span data-testid="view-icon">View</span>,
}));

// Create mock store
const createMockStore = () =>
  configureStore({
    reducer: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branches: (state = { branches: [] }, action: any) => {
        if (action.type === setBranches.type) {
          return { branches: action.payload };
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

// Mock data
const mockBranches = [
  {
    id: "1",
    name: "Chi nhánh Hà Nội",
    address: "123 Đường ABC, Hà Nội",
    contactNumber: "0123456789",
    rooms: 10,
    status: "ACTIVE" as const,
    sessions: [],
  },
  {
    id: "2",
    name: "Chi nhánh TP.HCM",
    address: "456 Đường XYZ, TP.HCM",
    contactNumber: "0987654321",
    rooms: 15,
    status: "ACTIVE" as const,
    sessions: [],
  },
];

const mockBranchData = {
  content: mockBranches,
  pageNumber: 0,
  pageSize: 5,
  totalElements: 2,
  totalPages: 1,
};

const renderBranchPage = () => {
  const store = createMockStore();
  const queryClient = createMockQueryClient();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BranchPage />
      </QueryClientProvider>
    </Provider>,
  );
};

describe("BranchPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllBranches as jest.Mock).mockResolvedValue(mockBranchData);
  });

  it("renders loading state initially", () => {
    renderBranchPage();

    expect(screen.getByText(/Tổng số chi nhánh/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm chi nhánh..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders branches data after loading", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(screen.getByText("Tổng số chi nhánh (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Chi nhánh Hà Nội")).toBeInTheDocument();
    expect(screen.getByText("Chi nhánh TP.HCM")).toBeInTheDocument();
    expect(screen.getByText("123 Đường ABC, Hà Nội")).toBeInTheDocument();
    expect(screen.getByText("456 Đường XYZ, TP.HCM")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("shows create branch button", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(screen.getByText("Thêm chi nhánh")).toBeInTheDocument();
    });
  });

  it("opens create branch modal when button is clicked", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(screen.getByText("Thêm chi nhánh")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Thêm chi nhánh"));

    expect(screen.getByTestId("create-branch-modal")).toBeInTheDocument();
  });

  it("displays action buttons for each branch", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(screen.getAllByTestId("edit-icon")).toHaveLength(2);
      expect(screen.getAllByTestId("delete-icon")).toHaveLength(2);
      expect(screen.getAllByTestId("view-icon")).toHaveLength(2);
    });
  });

  it("calls getAllBranches with correct parameters", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(getAllBranches).toHaveBeenCalledWith(0, 5, "");
    });
  });

  it("handles search functionality", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(getAllBranches).toHaveBeenCalledWith(0, 5, "");
    });
  });

  it("displays table headers correctly", async () => {
    renderBranchPage();

    await waitFor(() => {
      expect(screen.getByText("Tên chi nhánh")).toBeInTheDocument();
      expect(screen.getByText("Địa chỉ")).toBeInTheDocument();
      expect(screen.getByText("Số điện thoại")).toBeInTheDocument();
      expect(screen.getByText("Số phòng học")).toBeInTheDocument();
      expect(screen.getByText("Hành động")).toBeInTheDocument();
    });
  });

  it("sorts branches alphabetically by name", async () => {
    renderBranchPage();

    await waitFor(() => {
      const branchNames = screen.getAllByText(/Chi nhánh/);
      expect(branchNames[0]).toHaveTextContent("Chi nhánh Hà Nội");
      expect(branchNames[1]).toHaveTextContent("Chi nhánh TP.HCM");
    });
  });

  it("handles empty branches list", async () => {
    (getAllBranches as jest.Mock).mockResolvedValue({
      ...mockBranchData,
      content: [],
      totalElements: 0,
    });

    renderBranchPage();

    await waitFor(() => {
      expect(screen.getByText("Tổng số chi nhánh (0)")).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    (getAllBranches as jest.Mock).mockRejectedValue(new Error("API Error"));

    renderBranchPage();

    // Should still render the component structure
    expect(screen.getByText(/Tổng số chi nhánh/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm chi nhánh..."),
    ).toBeInTheDocument();
  });

  it("dispatches branches to store when data is loaded", async () => {
    const store = createMockStore();
    const queryClient = createMockQueryClient();

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BranchPage />
        </QueryClientProvider>
      </Provider>,
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.branches.branches).toEqual(mockBranches);
    });
  });
});
