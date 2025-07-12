/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentAttendance from "@/app/ui/components/user/student/attendance/StudentAttendance";
import { getAllStudentClasses } from "@/app/lib/services/class";
import { getAttendanceListByStudent } from "@/app/lib/services/attendance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the services
jest.mock("@/app/lib/services/class");
jest.mock("@/app/lib/services/attendance");

// Mock the child components
jest.mock(
  "@/app/ui/components/user/parent/attendance/AttendanceCalendar",
  () => {
    return function MockAttendanceCalendar({ mockAttendanceData }: any) {
      return (
        <div data-testid="attendance-calendar">
          Calendar Component - Present: {mockAttendanceData.summary.present}
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/user/parent/attendance/AttendanceList", () => {
  return function MockAttendanceList({ mockAttendanceData }: any) {
    return (
      <div data-testid="attendance-list">
        List Component - Total: {mockAttendanceData.summary.totalClasses}
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/user/parent/attendance/AttendanceSummary",
  () => {
    return function MockAttendanceSummary({ mockAttendanceData }: any) {
      return (
        <div data-testid="attendance-summary">
          Summary Component - Present:{" "}
          {mockAttendanceData.summary.presentPercentage}%
        </div>
      );
    };
  },
);

// Mock the Select component to avoid DOM nesting issues
jest.mock("@/app/ui/components/_common/Select", () => {
  const SelectItem = ({ children, value }: any) => {
    return <div data-value={value}>{children}</div>;
  };
  const Select = ({
    children,
    onValueChange,
    defaultLabel,
    className,
  }: any) => {
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
    // If children is a single SelectItem with value === '', render the 'Không có lớp nào' option
    const isEmptyOption =
      React.isValidElement(children) &&
      children.type === SelectItem &&
      (children.props as any).value === "";
    return (
      <div className={className}>
        <select
          data-testid="mock-select"
          value={value}
          onChange={handleChange}
          className="w-full bg-white"
        >
          <option value="">{defaultLabel}</option>
          {isEmptyOption ? (
            <option value="">Không có lớp nào</option>
          ) : (
            React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectItem) {
                const childValue = (child.props as any).value;
                const childText = React.Children.toArray(
                  (child.props as any).children,
                )
                  .map((c: any) => {
                    if (typeof c === "string") return c;
                    if (React.isValidElement(c) && (c.props as any).children) {
                      return React.Children.toArray((c.props as any).children)
                        .map((gc: any) => (typeof gc === "string" ? gc : ""))
                        .join(" ")
                        .trim();
                    }
                    return "";
                  })
                  .join(" ")
                  .trim();
                return (
                  <option key={childValue} value={childValue}>
                    {childText || childValue}
                  </option>
                );
              }
              return null;
            })
          )}
        </select>
      </div>
    );
  };
  return { Select, SelectItem };
});

// Mock the Tabs component
jest.mock("@/app/ui/components/_common/Tabs", () => ({
  Tab: ({ label, value }: any) => (
    <button data-testid={`tab-${value}`} data-value={value}>
      {label}
    </button>
  ),
  TabList: ({ children, className }: any) => (
    <div data-testid="tab-list" className={className}>
      {children}
    </div>
  ),
  TabPanel: ({ children, value }: any) => (
    <div data-testid={`tab-panel-${value}`} data-value={value}>
      {children}
    </div>
  ),
  Tabs: ({ children, className }: any) => (
    <div data-testid="tabs" className={className}>
      {children}
    </div>
  ),
}));

const mockGetAllStudentClasses = getAllStudentClasses as jest.MockedFunction<
  typeof getAllStudentClasses
>;
const mockGetAttendanceListByStudent =
  getAttendanceListByStudent as jest.MockedFunction<
    typeof getAttendanceListByStudent
  >;

// Helper function to render with QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("StudentAttendance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the attendance page header", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByText("Trang điểm danh")).toBeInTheDocument();
        expect(
          screen.getByText("Theo dõi tình hình điểm danh của bạn"),
        ).toBeInTheDocument();
      });
    });

    it("should render class selection dropdown", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
        expect(screen.getByText("Chọn lớp học")).toBeInTheDocument();
      });
    });

    it("should render current selection info section", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByText("Thông tin hiện tại")).toBeInTheDocument();
      });
    });
  });

  describe("Class Selection", () => {
    it("should display available classes in dropdown and allow selection", async () => {
      const mockClasses = {
        content: [
          {
            id: "class1",
            name: "Lớp Toán 10A1",
            description: "Lớp chuyên Toán",
            course: { id: "course1", name: "Toán học" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
          {
            id: "class2",
            name: "Lớp Văn 10A1",
            description: "Lớp chuyên Văn",
            course: { id: "course2", name: "Ngữ văn" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
        ],
        totalElements: 2,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      };

      const mockAttendanceData = {
        data: [
          {
            id: "1",
            date: "2025-07-15T10:00:00Z",
            status: "PRESENT",
            note: "Đi học đầy đủ",
            classSession: {
              id: "session1",
              day: "MONDAY" as const,
              room: "Room 101",
              session: {
                name: "Toán học",
                startTime: "08:00",
                endTime: "09:30",
              },
            },
          },
        ],
        message: "Success",
        statusCode: "200",
      } as any;

      mockGetAllStudentClasses.mockResolvedValue(mockClasses as any);
      mockGetAttendanceListByStudent.mockResolvedValue(mockAttendanceData);

      renderWithQueryClient(<StudentAttendance />);

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "class1" } });

      // Wait for attendance data to load and tabs to appear
      await waitFor(() => {
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
        expect(screen.getByTestId("attendance-calendar")).toBeInTheDocument();
      });

      // Check that attendance components are rendered
      expect(screen.getByTestId("attendance-calendar")).toBeInTheDocument();
      expect(screen.getByTestId("attendance-list")).toBeInTheDocument();
      expect(screen.getByTestId("attendance-summary")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should show loading state for classes", async () => {
      // Don't resolve the promise immediately to test loading state
      mockGetAllStudentClasses.mockImplementation(() => new Promise(() => {}));

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });
    });

    it("should show loading state for attendance data", async () => {
      const mockClasses = {
        content: [
          {
            id: "class1",
            name: "Lớp Toán 10A1",
            description: "Lớp chuyên Toán",
            course: { id: "course1", name: "Toán học" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      };

      mockGetAllStudentClasses.mockResolvedValue(mockClasses as any);
      mockGetAttendanceListByStudent.mockImplementation(
        () => new Promise(() => {}),
      );

      renderWithQueryClient(<StudentAttendance />);

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "class1" } });

      // Check loading state in current info section
      await waitFor(() => {
        expect(screen.getByText(/Đang tải/)).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("should show empty state when no class is selected", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByText("Chưa chọn lớp học")).toBeInTheDocument();
        expect(
          screen.getByText(/Vui lòng chọn lớp học từ danh sách/),
        ).toBeInTheDocument();
      });
    });

    it("should handle empty classes list", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        const select = screen.getByTestId("mock-select");
        // Check if any option contains the text 'Không có lớp nào'
        const found = Array.from(select.querySelectorAll("option")).some(
          (option) => option.textContent?.includes("Không có lớp nào"),
        );
        expect(found).toBe(true);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API error for classes", async () => {
      mockGetAllStudentClasses.mockRejectedValue(
        new Error("Failed to fetch classes"),
      );

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });
    });

    it("should handle API error for attendance data", async () => {
      const mockClasses = {
        content: [
          {
            id: "class1",
            name: "Lớp Toán 10A1",
            description: "Lớp chuyên Toán",
            course: { id: "course1", name: "Toán học" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      };

      mockGetAllStudentClasses.mockResolvedValue(mockClasses as any);
      mockGetAttendanceListByStudent.mockRejectedValue(
        new Error("Failed to fetch attendance"),
      );

      renderWithQueryClient(<StudentAttendance />);

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "class1" } });

      // Wait for tabs to appear (even with error)
      await waitFor(() => {
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
      });
    });
  });

  describe("Data Conversion", () => {
    it("should convert API data to component format correctly", async () => {
      const mockClasses = {
        content: [
          {
            id: "class1",
            name: "Lớp Toán 10A1",
            description: "Lớp chuyên Toán",
            course: { id: "course1", name: "Toán học" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      };

      const mockAttendanceData = {
        data: [
          {
            id: "1",
            date: "2025-07-15T10:00:00Z",
            status: "PRESENT",
            note: "Đi học đầy đủ",
            classSession: {
              id: "session1",
              day: "MONDAY" as const,
              room: "Room 101",
              session: {
                name: "Toán học",
                startTime: "08:00",
                endTime: "09:30",
              },
            },
          },
          {
            id: "2",
            date: "2025-07-16T10:00:00Z",
            status: "ABSENT",
            note: "Nghỉ ốm",
            classSession: {
              id: "session2",
              day: "TUESDAY" as const,
              room: "Room 101",
              session: {
                name: "Toán học",
                startTime: "08:00",
                endTime: "09:30",
              },
            },
          },
        ],
        message: "Success",
        statusCode: "200",
      } as any;

      mockGetAllStudentClasses.mockResolvedValue(mockClasses as any);
      mockGetAttendanceListByStudent.mockResolvedValue(mockAttendanceData);

      renderWithQueryClient(<StudentAttendance />);

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "class1" } });

      // Wait for attendance data to load
      await waitFor(() => {
        expect(screen.getByTestId("attendance-calendar")).toBeInTheDocument();
      });

      // Check that converted data is passed correctly
      expect(
        screen.getByText("Calendar Component - Present: 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("List Component - Total: 2")).toBeInTheDocument();
      expect(
        screen.getByText("Summary Component - Present: 50%"),
      ).toBeInTheDocument();
    });
  });

  describe("API Calls", () => {
    it("should call getAllStudentClasses on mount", async () => {
      mockGetAllStudentClasses.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      } as any);

      renderWithQueryClient(<StudentAttendance />);

      await waitFor(() => {
        expect(mockGetAllStudentClasses).toHaveBeenCalledWith(0, 100);
      });
    });

    it("should call getAttendanceListByStudent when class is selected", async () => {
      const mockClasses = {
        content: [
          {
            id: "class1",
            name: "Lớp Toán 10A1",
            description: "Lớp chuyên Toán",
            course: { id: "course1", name: "Toán học" },
            grade: { id: "grade1", name: "Lớp 10" },
          },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
        pageSize: 10,
        last: true,
      };

      const mockAttendanceData = {
        data: [],
        message: "Success",
        statusCode: "200",
      } as any;

      mockGetAllStudentClasses.mockResolvedValue(mockClasses as any);
      mockGetAttendanceListByStudent.mockResolvedValue(mockAttendanceData);

      renderWithQueryClient(<StudentAttendance />);

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByTestId("mock-select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "class1" } });

      await waitFor(() => {
        expect(mockGetAttendanceListByStudent).toHaveBeenCalledWith({
          classId: "class1",
          month: expect.any(Number),
          year: expect.any(Number),
        });
      });
    });
  });
});
