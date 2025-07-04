import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassesTable from "@/app/ui/components/admin/classes/ClassesTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the services
jest.mock("@/app/lib/services/class", () => ({
  getAllClasses: jest.fn(),
}));

// Mock the useEncodedRoute hook
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({
    handleNavigate: jest.fn(),
  }),
}));

// Mock the Table components
jest.mock("@/app/ui/components/_common/Table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({ columns }: { columns: string[] }) => (
    <thead data-testid="table-header">
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column}</th>
        ))}
      </tr>
    </thead>
  ),
  TableBody: ({
    children,
    isLoading,
  }: {
    children: React.ReactNode;
    isLoading?: boolean;
  }) => (
    <tbody data-testid="table-body" data-loading={isLoading}>
      {children}
    </tbody>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr data-testid="table-row">{children}</tr>
  ),
  TableCell: ({
    children,
    colSpan,
  }: {
    children: React.ReactNode;
    colSpan?: number;
  }) => (
    <td data-testid="table-cell" colSpan={colSpan}>
      {children}
    </td>
  ),
}));

// Mock the ClassPagination component
jest.mock("@/app/ui/components/admin/classes/ClassPagination", () => {
  return function MockClassPagination({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) {
    return (
      <div data-testid="pagination">
        <span data-testid="current-page">{currentPage}</span>
        <span data-testid="total-pages">{totalPages}</span>
      </div>
    );
  };
});

// Mock the Tooltip component
jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) {
    return (
      <div data-testid="tooltip" title={text}>
        {children}
      </div>
    );
  };
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: ({ className, onClick }: { className: string; onClick: () => void }) => (
    <button data-testid="eye-icon" className={className} onClick={onClick}>
      👁️
    </button>
  ),
}));

const mockClassData = {
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
    {
      id: "class-2",
      name: "Physics 101",
      course: { name: "Physics" },
      grade: { name: "Grade 11" },
      fee: 600000,
      startDate: "2024-02-01",
      endDate: "2024-07-30",
    },
  ],
  totalPages: 3,
  totalElements: 15,
  currentPage: 1,
  size: 5,
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("ClassesTable", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockGetAllClasses = require("@/app/lib/services/class").getAllClasses;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton initially", () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });

  it("renders table headers correctly", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByText("Tên lớp")).toBeInTheDocument();
      expect(screen.getByText("Môn học")).toBeInTheDocument();
      expect(screen.getByText("Khối")).toBeInTheDocument();
      expect(screen.getByText("Học phí")).toBeInTheDocument();
      expect(screen.getByText("Ngày bắt đầu")).toBeInTheDocument();
      expect(screen.getByText("Ngày kết thúc")).toBeInTheDocument();
    });
  });

  it("renders class data correctly", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByText("Mathematics 101")).toBeInTheDocument();
      expect(screen.getByText("Mathematics")).toBeInTheDocument();
      expect(screen.getByText("Grade 10")).toBeInTheDocument();
      expect(screen.getByText("500000 VNĐ")).toBeInTheDocument();
      expect(screen.getByText("2024-01-01")).toBeInTheDocument();
      expect(screen.getByText("2024-06-30")).toBeInTheDocument();
    });
  });

  it("renders multiple classes", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByText("Mathematics 101")).toBeInTheDocument();
      expect(screen.getByText("Physics 101")).toBeInTheDocument();
    });
  });

  it("shows pagination when data is loaded", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
      expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
    });
  });

  it("renders eye icons for each class", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      const eyeIcons = screen.getAllByTestId("eye-icon");
      expect(eyeIcons).toHaveLength(2);
    });
  });

  it("shows tooltips on eye icons", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      const tooltips = screen.getAllByTestId("tooltip");
      expect(tooltips).toHaveLength(2);
      tooltips.forEach((tooltip) => {
        expect(tooltip).toHaveAttribute("title", "Xem lớp học");
      });
    });
  });

  it("handles empty data gracefully", async () => {
    const emptyData = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 1,
      size: 5,
    };

    mockGetAllClasses.mockResolvedValue(emptyData);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
      expect(screen.queryByTestId("eye-icon")).not.toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    const error = new Error("Failed to fetch classes");
    mockGetAllClasses.mockRejectedValue(error);

    renderWithQueryClient(<ClassesTable query="test" currentPage={1} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch classes")).toBeInTheDocument();
    });
  });

  it("calls getAllClasses with correct parameters", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    renderWithQueryClient(<ClassesTable query="test query" currentPage={2} />);

    await waitFor(() => {
      expect(mockGetAllClasses).toHaveBeenCalledWith("test query", 1, 5);
    });
  });

  it("updates when query or currentPage changes", async () => {
    mockGetAllClasses.mockResolvedValue(mockClassData);

    const { rerender } = renderWithQueryClient(
      <ClassesTable query="initial" currentPage={1} />,
    );

    await waitFor(() => {
      expect(mockGetAllClasses).toHaveBeenCalledWith("initial", 0, 5);
    });

    mockGetAllClasses.mockClear();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ClassesTable query="updated" currentPage={3} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(mockGetAllClasses).toHaveBeenCalledWith("updated", 2, 5);
    });
  });
});
