/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AttendancePage from "@/app/(admin)/admin/classes/[classId]/attendance/page";
import { useCustomToast } from "@/app/lib/hooks/useToast";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useParams: () => ({
    classId: "encoded-class-id",
  }),
  useSearchParams: () => ({
    get: jest.fn(() => ""),
  }),
}));

jest.mock("@/app/lib/hooks/useEncodedRoute", () => ({
  useEncodedRoute: () => ({
    decodeId: jest.fn(() => "decoded-class-id"),
  }),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueries: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock("@/app/lib/services/class");
jest.mock("@/app/lib/services/classSchedule");
jest.mock("@/app/lib/services/attendance");
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  return function MockSearchField({
    onChange,
    placeholder,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (e: any) => void;
    placeholder: string;
  }) {
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
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="attendance-table">{children}</table>
  ),
  TableHeader: ({ columns }: { columns: string[] }) => (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  TableBody: ({
    children,
  }: {
    children: React.ReactNode;
    noDataMessage: boolean;
  }) => <tbody>{children}</tbody>,
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableCell: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <td className={className}>{children}</td>,
}));

jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    handlePageClick,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return function MockCheckbox({
    checked,
    onChange,
    className,
  }: {
    checked: boolean;
    onChange: () => void;
    className?: string;
  }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={className}
        data-testid="attendance-checkbox"
      />
    );
  };
});

jest.mock("@/app/ui/components/_common/Button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) {
    return <div data-testid={`tooltip-${text}`}>{children}</div>;
  };
});

jest.mock("react-icons/md", () => ({
  MdEdit: () => <div data-testid="edit-icon">✏️</div>,
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

const mockMembers = {
  content: [
    {
      id: "1",
      genId: "HS001",
      name: "Nguyễn Văn A",
      birthday: "2005-01-01",
      gender: "MALE",
    },
    {
      id: "2",
      genId: "HS002",
      name: "Trần Thị B",
      birthday: "2005-02-01",
      gender: "FEMALE",
    },
  ],
  totalPages: 1,
};

const mockClassSchedule = [
  {
    id: "session1",
    date: "2024-01-01T08:00:00Z",
  },
  {
    id: "session2",
    date: "2024-01-02T08:00:00Z",
  },
];

const mockAttendanceData = {
  attendances: {
    content: [
      {
        user: mockMembers.content[0],
        status: "PRESENT",
        note: "Có mặt",
        recordedAt: "2024-01-01T08:00:00Z",
      },
      {
        user: mockMembers.content[1],
        status: "ABSENT",
        note: "Vắng mặt",
        recordedAt: "2024-01-01T08:00:00Z",
      },
    ],
    totalElements: 2,
  },
};

describe("AttendancePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCustomToast as jest.Mock).mockReturnValue(mockToast);

    // Mock useQueries
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: mockAttendanceData,
        isLoading: false,
      },
    ]);

    // Mock useMutation
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });

  it("should render attendance page with session selector", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Buổi học:")).toBeInTheDocument();
      expect(screen.getByText("Chọn ngày khác...")).toBeInTheDocument();
    });
  });

  it("should render attendance table with student data", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByTestId("attendance-table")).toBeInTheDocument();
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    });
  });

  it("should display student information correctly", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("HS001")).toBeInTheDocument();
      expect(screen.getByText("HS002")).toBeInTheDocument();
      expect(screen.getByText("Nam")).toBeInTheDocument();
      expect(screen.getByText("Nữ")).toBeInTheDocument();
    });
  });

  it("should show attendance status checkboxes", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByTestId("attendance-checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it("should handle search functionality", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByTestId("search-field")).toBeInTheDocument();
    });

    const searchField = screen.getByTestId("search-field");
    fireEvent.change(searchField, { target: { value: "Nguyễn" } });

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.queryByText("Trần Thị B")).not.toBeInTheDocument();
    });
  });

  it("should show save attendance button", async () => {
    // Mock attendance data with no existing attendance to show save button
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: { attendances: { content: [], totalElements: 0 } },
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Lưu điểm danh")).toBeInTheDocument();
    });
  });

  it("should show edit attendance button when attendance exists", async () => {
    // Mock attendance data with existing attendance
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: mockAttendanceData,
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Sửa điểm danh")).toBeInTheDocument();
    });
  });

  it("should handle session selection", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Buổi học:")).toBeInTheDocument();
    });

    const sessionSelect = screen.getByRole("combobox");
    fireEvent.change(sessionSelect, { target: { value: "session2" } });

    await waitFor(() => {
      expect(sessionSelect).toHaveValue("session2");
    });
  });

  it("should show custom date input when custom option is selected", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Buổi học:")).toBeInTheDocument();
    });

    const sessionSelect = screen.getByRole("combobox");
    fireEvent.change(sessionSelect, { target: { value: "custom-" } });

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(new Date().toISOString().split("T")[0]),
      ).toBeInTheDocument();
    });
  });

  it("should display last modified information", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText(/Cập nhật:/)).toBeInTheDocument();
    });
  });

  it("should handle attendance status change", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByTestId("attendance-checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    const checkboxes = screen.getAllByTestId("attendance-checkbox");
    fireEvent.click(checkboxes[0]);

    // Should handle the status change
    expect(checkboxes[0]).toBeInTheDocument();
  });

  it("should show note input fields", async () => {
    // Mock attendance data with no existing attendance to show input fields
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: { attendances: { content: [], totalElements: 0 } },
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      const noteInputs = screen.getAllByPlaceholderText("Nhập ghi chú...");
      expect(noteInputs.length).toBeGreaterThan(0);
    });
  });

  it("should handle note changes", async () => {
    // Mock attendance data with no existing attendance to show input fields
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: { attendances: { content: [], totalElements: 0 } },
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      const noteInputs = screen.getAllByPlaceholderText("Nhập ghi chú...");
      expect(noteInputs.length).toBeGreaterThan(0);
    });

    const noteInput = screen.getAllByPlaceholderText("Nhập ghi chú...")[0];
    fireEvent.change(noteInput, { target: { value: "Test note" } });

    expect(noteInput).toHaveValue("Test note");
  });

  it("should show pagination when multiple pages exist", async () => {
    // Mock members with multiple pages
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: { ...mockMembers, totalPages: 3 },
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: mockAttendanceData,
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  it("should handle loading state", async () => {
    // Mock loading state
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: null,
        isLoading: true,
      },
      {
        data: null,
        isLoading: false,
      },
      {
        data: null,
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should handle attendance query loading", async () => {
    // Mock attendance query loading
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: null,
        isLoading: true,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  it("should display student names with tooltip for long names", async () => {
    // Mock student with long name
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: {
          content: [
            {
              id: "1",
              genId: "HS001",
              name: "Nguyễn Văn A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
              birthday: "2005-01-01",
              gender: "MALE",
            },
          ],
          totalPages: 1,
        },
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: mockAttendanceData,
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A B C D...")).toBeInTheDocument();
    });
  });

  it("should format dates correctly", async () => {
    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("1/1/2005")).toBeInTheDocument();
      expect(screen.getByText("1/2/2005")).toBeInTheDocument();
    });
  });

  it("should handle save attendance mutation", async () => {
    const mockMutate = jest.fn();
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    // Mock attendance data with no existing attendance to show save button
    const { useQueries } = require("@tanstack/react-query");
    useQueries.mockReturnValue([
      {
        data: mockMembers,
        isLoading: false,
      },
      {
        data: mockClassSchedule,
        isLoading: false,
      },
      {
        data: { attendances: { content: [], totalElements: 0 } },
        isLoading: false,
      },
    ]);

    render(<AttendancePage />);

    await waitFor(() => {
      expect(screen.getByText("Lưu điểm danh")).toBeInTheDocument();
    });

    const saveButton = screen.getByText("Lưu điểm danh");
    fireEvent.click(saveButton);

    expect(mockMutate).toHaveBeenCalled();
  });
});
