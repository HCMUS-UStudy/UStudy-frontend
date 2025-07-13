/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import MemberPage from "@/app/(user)/teacher/classes/[classId]/members/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock services
jest.mock("@/app/lib/services/class", () => ({
  getListMembers: jest.fn(),
}));

// Mock components
jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({ children, text }: any) {
    return (
      <div data-testid="tooltip" title={text}>
        {children}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  return function MockSearchField({ onChange, placeholder }: any) {
    return (
      <input
        data-testid="search-field"
        placeholder={placeholder}
        onChange={onChange}
      />
    );
  };
});

jest.mock("@/app/ui/components/_common/Table", () => ({
  Table: ({ children }: any) => <table data-testid="table">{children}</table>,
  TableHeader: ({ columns }: any) => (
    <thead data-testid="table-header">
      <tr>
        {columns.map((col: string, index: number) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  TableBody: ({ children }: any) => (
    <tbody data-testid="table-body">{children}</tbody>
  ),
  TableRow: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
  TableCell: ({ children }: any) => (
    <td data-testid="table-cell">{children}</td>
  ),
}));

jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    handlePreviousPage,
    handleNextPage,
  }: any) {
    return (
      <div data-testid="pagination">
        <button onClick={handlePreviousPage}>Previous</button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    );
  };
});

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("Teacher Class Members Page", () => {
  let queryClient: QueryClient;

  const mockMembers = {
    content: [
      {
        id: "1",
        genId: "ST001",
        email: "student1@example.com",
        name: "Nguyễn Văn A",
        avatar: "",
        gender: "MALE",
        birthday: "2005-01-01",
        address: "Hà Nội",
      },
      {
        id: "2",
        genId: "1GV001", // Changed to start with "1" to map to "Giáo viên"
        email: "teacher1@example.com",
        name: "Trần Thị B",
        avatar: "",
        gender: "FEMALE",
        birthday: "1985-02-01",
        address: "Hồ Chí Minh",
      },
      {
        id: "3",
        genId: "0AD001",
        email: "admin1@example.com",
        name: "Lê Văn C",
        avatar: "",
        gender: "MALE",
        birthday: "1980-03-01",
        address: "Đà Nẵng",
      },
    ],
    totalPages: 2,
    totalElements: 3,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUseParams.mockReturnValue({ classId: "class1" });
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(""),
    } as any);

    const { getListMembers } = require("@/app/lib/services/class");
    getListMembers.mockResolvedValue(mockMembers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders members page with loading state initially", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders members page with data after loading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("displays search field", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("search-field")).toBeInTheDocument();
    });
  });

  it("displays table with correct headers", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table-header")).toBeInTheDocument();
    });
  });

  it("displays member information in table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
      expect(screen.getByText("Lê Văn C")).toBeInTheDocument();
    });
  });

  it("displays correct role based on genId", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getAllByText("Học sinh")).toHaveLength(1);
      expect(screen.getAllByText("Giáo viên")).toHaveLength(1);
      expect(screen.getAllByText("Giáo vụ")).toHaveLength(1);
    });
  });

  it("displays gender correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getAllByText("Nam")).toHaveLength(2);
      expect(screen.getByText("Nữ")).toBeInTheDocument();
    });
  });

  it("displays birthday in Vietnamese format", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("1/1/2005")).toBeInTheDocument();
      expect(screen.getByText("1/2/1985")).toBeInTheDocument();
      expect(screen.getByText("1/3/1980")).toBeInTheDocument();
    });
  });

  it("displays pagination when there are multiple pages", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("handles search functionality by name", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const searchField = screen.getByTestId("search-field");
      fireEvent.change(searchField, { target: { value: "Nguyễn" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.queryByText("Trần Thị B")).not.toBeInTheDocument();
      expect(screen.queryByText("Lê Văn C")).not.toBeInTheDocument();
    });
  });

  it("handles search functionality by genId", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const searchField = screen.getByTestId("search-field");
      fireEvent.change(searchField, { target: { value: "ST001" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.queryByText("Trần Thị B")).not.toBeInTheDocument();
      expect(screen.queryByText("Lê Văn C")).not.toBeInTheDocument();
    });
  });

  it("handles case-insensitive search", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const searchField = screen.getByTestId("search-field");
      fireEvent.change(searchField, { target: { value: "nguyễn" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });
  });

  it("shows tooltip for long names", async () => {
    const longNameMember = {
      ...mockMembers,
      content: [
        {
          ...mockMembers.content[0],
          name: "Nguyễn Văn A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        },
      ],
    };

    const { getListMembers } = require("@/app/lib/services/class");
    getListMembers.mockResolvedValue(longNameMember);

    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });
  });

  it("shows tooltip for long emails on desktop", async () => {
    const longEmailMember = {
      ...mockMembers,
      content: [
        {
          ...mockMembers.content[0],
          email: "verylongemailaddress@verylongdomainname.com",
        },
      ],
    };

    const { getListMembers } = require("@/app/lib/services/class");
    getListMembers.mockResolvedValue(longEmailMember);

    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });
  });

  it("handles pagination navigation", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const pagination = screen.getByTestId("pagination");
      expect(pagination).toBeInTheDocument();
    });
  });

  it("handles empty member list", async () => {
    const emptyMembers = {
      content: [],
      totalPages: 0,
      totalElements: 0,
    };

    const { getListMembers } = require("@/app/lib/services/class");
    getListMembers.mockResolvedValue(emptyMembers);

    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("handles error state gracefully", async () => {
    const { getListMembers } = require("@/app/lib/services/class");
    getListMembers.mockRejectedValue(new Error("Failed to fetch"));

    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("responds to window resize for mobile view", async () => {
    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });

    // Test resize event
    fireEvent(window, new Event("resize"));
  });

  it("displays correct number of table rows", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const tableRows = screen.getAllByTestId("table-row");
      expect(tableRows).toHaveLength(3);
    });
  });

  it("displays correct number of table cells per row", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const tableCells = screen.getAllByTestId("table-cell");
      // 3 members * 5 columns on mobile (GenId, Tên, Ngày sinh, Giới tính, Vai trò) - Email is hidden on mobile
      expect(tableCells).toHaveLength(15);
    });
  });
});
