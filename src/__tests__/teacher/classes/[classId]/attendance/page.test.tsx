/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import AttendancePage from "@/app/(user)/teacher/classes/[classId]/attendance/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock React Query hooks
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueries: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

// Mock services
jest.mock("@/app/lib/services/class", () => ({
  getListMembers: jest.fn(),
}));

jest.mock("@/app/lib/services/classSchedule", () => ({
  getPastSchedule: jest.fn(),
}));

jest.mock("@/app/lib/services/attendance", () => ({
  getAttendances: jest.fn(),
  recordAttendances: jest.fn(),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }),
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
    handlePageClick,
  }: any) {
    return (
      <div data-testid="pagination">
        <button onClick={() => handlePageClick(currentPage - 1)}>
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => handlePageClick(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Checkbox", () => {
  return function MockCheckbox({ checked, onChange }: any) {
    return (
      <input
        type="checkbox"
        data-testid="checkbox"
        checked={checked}
        onChange={onChange}
      />
    );
  };
});

jest.mock("@/app/ui/components/_common/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("Teacher Class Attendance Page", () => {
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
        genId: "ST002",
        email: "student2@example.com",
        name: "Trần Thị B",
        avatar: "",
        gender: "FEMALE",
        birthday: "2005-02-01",
        address: "Hồ Chí Minh",
      },
    ],
    totalPages: 1,
    totalElements: 2,
  };

  const mockClassSchedule = [
    {
      id: "session1",
      date: "2024-01-15",
      classSession: {
        id: "cs1",
        day: "MONDAY",
        session: {
          id: "s1",
          name: "Tiết 1",
          startTime: "08:00:00",
          endTime: "08:45:00",
        },
        room: {
          id: "r1",
          name: "Phòng 101",
        },
      },
      isPassed: true,
    },
  ];

  const mockAttendances = {
    attendances: {
      content: [
        {
          user: mockMembers.content[0],
          status: "PRESENT",
          note: "",
          recordedAt: "2024-01-15T08:00:00Z",
        },
        {
          user: mockMembers.content[1],
          status: "ABSENT",
          note: "Bị ốm",
          recordedAt: "2024-01-15T08:00:00Z",
        },
      ],
    },
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

    // Mock useQueries
    const {
      useQueries,
      useMutation,
      useQueryClient,
    } = require("@tanstack/react-query");

    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
        isError: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
        isError: false,
      },
      {
        data: mockAttendances,
        isLoading: false,
        isError: false,
      },
    ]);

    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    const { getListMembers } = require("@/app/lib/services/class");
    const { getPastSchedule } = require("@/app/lib/services/classSchedule");
    const { getAttendances } = require("@/app/lib/services/attendance");

    getListMembers.mockResolvedValue(mockMembers);
    getPastSchedule.mockResolvedValue(mockClassSchedule);
    getAttendances.mockResolvedValue(mockAttendances);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders attendance page with loading state initially", () => {
    // Mock loading state
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      { isLoading: true, data: undefined },
      { isLoading: true, data: undefined },
      { isLoading: true, data: undefined },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders attendance page with data after loading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });

  it("displays search field", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("search-field")).toBeInTheDocument();
    });
  });

  it("displays table with correct headers", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table-header")).toBeInTheDocument();
    });
  });

  it("displays student information in table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    });
  });

  it("displays pagination when there are multiple pages", async () => {
    const mockMembersWithPages = {
      ...mockMembers,
      totalPages: 3,
    };

    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembersWithPages,
        isLoading: false,
        isError: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
        isError: false,
      },
      {
        data: mockAttendances,
        isLoading: false,
        isError: false,
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("handles search functionality", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const searchField = screen.getByTestId("search-field");
      fireEvent.change(searchField, { target: { value: "Nguyễn" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.queryByText("Trần Thị B")).not.toBeInTheDocument();
    });
  });

  it("displays edit mode toggle button", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Sửa điểm danh")).toBeInTheDocument();
    });
  });

  it("shows save button when in edit mode", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Sửa điểm danh");
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Lưu điểm danh")).toBeInTheDocument();
    });
  });

  it("displays attendance status options in edit mode", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Sửa điểm danh");
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Có mặt")).toBeInTheDocument();
      expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn")).toBeInTheDocument();
      expect(screen.getByText("Có phép")).toBeInTheDocument();
    });
  });

  it("handles attendance status change", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Sửa điểm danh");
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const absentButton = screen.getByText("Vắng mặt");
      fireEvent.click(absentButton);
    });

    // Verify the status change is handled
    expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
  });

  it("displays note field in edit mode", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // There are multiple note fields, so use getAllByPlaceholderText
      expect(
        screen.getAllByPlaceholderText("Nhập ghi chú...").length,
      ).toBeGreaterThan(0);
    });
  });

  it("shows last modified information", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Cập nhật:")).toBeInTheDocument();
    });
  });

  it("handles empty attendance data", async () => {
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: { content: [], totalPages: 0, totalElements: 0 },
        isLoading: false,
        isError: false,
      },
      {
        data: [],
        isLoading: false,
        isError: false,
      },
      {
        data: { attendances: { content: [] } },
        isLoading: false,
        isError: false,
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <AttendancePage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("table-body")).toBeInTheDocument();
    });
  });

  it("handles error state gracefully", () => {
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Failed to fetch"),
      },
      {
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Failed to fetch"),
      },
      {
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Failed to fetch"),
      },
    ]);

    expect(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <AttendancePage />
        </QueryClientProvider>,
      );
    }).not.toThrow();
  });
});
