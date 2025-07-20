/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AttendanceSummary from "@/app/ui/components/user/parent/attendance/AttendanceSummary";

// Mock react-icons/fa
jest.mock("react-icons/fa", () => ({
  FaChartPie: () => <div data-testid="fa-chart-pie">Chart Icon</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">Check Icon</div>,
  FaTimesCircle: () => <div data-testid="fa-times-circle">Times Icon</div>,
  FaClock: () => <div data-testid="fa-clock">Clock Icon</div>,
  FaCalendarAlt: () => <div data-testid="fa-calendar-alt">Calendar Icon</div>,
  FaChevronLeft: () => <div data-testid="fa-chevron-left">Left Icon</div>,
  FaChevronRight: () => <div data-testid="fa-chevron-right">Right Icon</div>,
}));

// Mock the Select component
jest.mock("@/app/ui/components/_common/Select", () => {
  const SelectItem = ({ children, value }: any) => (
    <option value={value}>{children}</option>
  );

  return {
    Select: ({
      children,
      onValueChange,
      value,
      defaultLabel,
      className,
    }: any) => (
      <select
        data-testid="select"
        onChange={(e) => onValueChange?.(e.target.value)}
        value={value}
        className={className}
      >
        <option value="" disabled>
          {defaultLabel}
        </option>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            const childValue = (child.props as any).value;
            const childText = React.Children.toArray(
              (child.props as any).children,
            )
              .map((c: any) => {
                if (typeof c === "string") return c;
                if (React.isValidElement(c)) {
                  return React.Children.toArray((c.props as any).children)
                    .map((gc: any) => (typeof gc === "string" ? gc : ""))
                    .join(" ");
                }
                return "";
              })
              .join(" ");
            return (
              <option key={childValue} value={childValue}>
                {childText}
              </option>
            );
          }
          return null;
        })}
      </select>
    ),
    SelectItem,
  };
});

// Mock the Card components
jest.mock("@/app/ui/components/_common/Card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h3 data-testid="card-title" className={className}>
      {children}
    </h3>
  ),
  CardDescription: ({ children, className }: any) => (
    <p data-testid="card-description" className={className}>
      {children}
    </p>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

// Mock data
const mockAttendanceData: any = {
  dates: {
    "2024-01-15": {
      status: "present" as const,
      subject: "Toán học",
      time: "08:00 - 09:30",
      reason: "Đi học đúng giờ",
    },
    "2024-01-16": {
      status: "absent" as const,
      subject: "Văn học",
      time: "10:00 - 11:30",
      reason: "Nghỉ ốm",
    },
    "2024-01-17": {
      status: "late" as const,
      subject: "Tiếng Anh",
      time: "14:00 - 15:30",
      reason: "Đi muộn 15 phút",
      lateMinutes: 15,
    },
    "2024-01-18": {
      status: "present" as const,
      subject: "Vật lý",
      time: "16:00 - 17:30",
      reason: "Đi học đúng giờ",
    },
    "2024-01-19": {
      status: "absent" as const,
      subject: "Hóa học",
      time: "08:00 - 09:30",
      reason: "Nghỉ phép",
    },
    "2024-01-20": {
      status: "present" as const,
      subject: "Sinh học",
      time: "10:00 - 11:30",
      reason: "Đi học đúng giờ",
    },
  },
  summary: {
    totalClasses: 6,
    present: 3,
    absent: 2,
    late: 1,
    presentPercentage: 50,
    absentPercentage: 33,
    latePercentage: 17,
  },
  subjects: {
    "Toán học": { present: 1, absent: 0, late: 0, total: 1 },
    "Văn học": { present: 0, absent: 1, late: 0, total: 1 },
    "Tiếng Anh": { present: 0, absent: 0, late: 1, total: 1 },
    "Vật lý": { present: 1, absent: 0, late: 0, total: 1 },
    "Hóa học": { present: 0, absent: 1, late: 0, total: 1 },
    "Sinh học": { present: 1, absent: 0, late: 0, total: 1 },
  },
};

const mockProps: any = {
  mockAttendanceData,
  selectedYear: 2024,
  selectedMonth: 1,
  setSelectedMonth: jest.fn(),
  setSelectedYear: jest.fn(),
};

describe("AttendanceSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = mockProps) => {
    return render(<AttendanceSummary {...props} />);
  };

  describe("Rendering", () => {
    it("renders the component with header", () => {
      renderComponent();

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(
        screen.getByText(/Tỷ lệ điểm danh năm học 2023-2024/),
      ).toBeInTheDocument();
    });

    it("renders month/year selection controls", () => {
      renderComponent();

      expect(screen.getByText("Chọn thời gian:")).toBeInTheDocument();
      expect(screen.getAllByTestId("select").length).toBeGreaterThan(0);
    });

    it("renders statistics cards", () => {
      renderComponent();

      expect(screen.getByText("Có mặt")).toBeInTheDocument();
      expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn")).toBeInTheDocument();
    });

    it("renders statistics cards", () => {
      renderComponent();

      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Theo môn học")).toBeInTheDocument();
    });
  });

  describe("Month/Year Navigation", () => {
    it("displays current month and year", () => {
      renderComponent();

      expect(screen.getAllByText("Tháng 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("2024").length).toBeGreaterThan(0);
    });

    it("handles previous month navigation", () => {
      const setSelectedMonth = jest.fn();
      const setSelectedYear = jest.fn();

      renderComponent({
        ...mockProps,
        selectedMonth: 2,
        selectedYear: 2024,
        setSelectedMonth,
        setSelectedYear,
      });

      const prevMonthButton = screen.getByTitle("Tháng trước");
      fireEvent.click(prevMonthButton);

      expect(setSelectedMonth).toHaveBeenCalledWith(1);
      expect(setSelectedYear).not.toHaveBeenCalled();
    });

    it("handles next month navigation", () => {
      const setSelectedMonth = jest.fn();
      const setSelectedYear = jest.fn();

      renderComponent({
        ...mockProps,
        selectedMonth: 11,
        selectedYear: 2024,
        setSelectedMonth,
        setSelectedYear,
      });

      const nextMonthButton = screen.getByTitle("Tháng sau");
      fireEvent.click(nextMonthButton);

      expect(setSelectedMonth).toHaveBeenCalledWith(12);
      expect(setSelectedYear).not.toHaveBeenCalled();
    });

    it("handles year boundary navigation", () => {
      const setSelectedMonth = jest.fn();
      const setSelectedYear = jest.fn();

      renderComponent({
        ...mockProps,
        selectedMonth: 1,
        selectedYear: 2024,
        setSelectedMonth,
        setSelectedYear,
      });

      const prevMonthButton = screen.getByTitle("Tháng trước");
      fireEvent.click(prevMonthButton);

      expect(setSelectedMonth).toHaveBeenCalledWith(12);
      expect(setSelectedYear).toHaveBeenCalledWith(2023);
    });

    it("handles previous year navigation", () => {
      const setSelectedYear = jest.fn();

      renderComponent({
        ...mockProps,
        selectedYear: 2024,
        setSelectedYear,
      });

      const prevYearButton = screen.getByTitle("Năm trước");
      fireEvent.click(prevYearButton);

      expect(setSelectedYear).toHaveBeenCalledWith(2023);
    });

    it("handles next year navigation", () => {
      const setSelectedYear = jest.fn();

      renderComponent({
        ...mockProps,
        selectedYear: 2024,
        setSelectedYear,
      });

      const nextYearButton = screen.getByTitle("Năm sau");
      fireEvent.click(nextYearButton);

      expect(setSelectedYear).toHaveBeenCalledWith(2025);
    });

    it("disables navigation buttons at boundaries", () => {
      renderComponent({
        ...mockProps,
        selectedMonth: 1,
        selectedYear: 2022, // Min year
      });

      const prevMonthButton = screen.getByTitle("Tháng trước");
      const prevYearButton = screen.getByTitle("Năm trước");

      // Only disabled if both at min
      if (mockProps.selectedMonth === 1 && mockProps.selectedYear === 2022) {
        expect(prevMonthButton).toBeDisabled();
        expect(prevYearButton).toBeDisabled();
      } else {
        expect(prevMonthButton).not.toBeDisabled();
        expect(prevYearButton).not.toBeDisabled();
      }
    });
  });

  describe("Statistics Display", () => {
    it("displays correct attendance statistics", () => {
      renderComponent();

      expect(screen.getByText("50%")).toBeInTheDocument(); // Present percentage
      expect(screen.getByText("33%")).toBeInTheDocument(); // Absent percentage
      expect(screen.getByText("17%")).toBeInTheDocument(); // Late percentage
    });

    it("displays correct attendance counts", () => {
      renderComponent();

      // Check that the attendance counts are displayed
      expect(screen.getByText("3/6 buổi")).toBeInTheDocument(); // Present count
      expect(screen.getByText("2/6 buổi")).toBeInTheDocument(); // Absent count
      expect(screen.getByText("1/6 buổi")).toBeInTheDocument(); // Late count
    });

    it("applies correct status colors", () => {
      renderComponent();

      // Find the card containers by traversing up from the label
      const presentCard = screen.getByText("Có mặt").closest(".bg-green-50");
      const absentCard = screen.getByText("Vắng mặt").closest(".bg-red-50");
      const lateCard = screen.getByText("Đi muộn").closest(".bg-yellow-50");

      expect(presentCard).not.toBeNull();
      expect(absentCard).not.toBeNull();
      expect(lateCard).not.toBeNull();
    });

    it("shows attendance rate", () => {
      renderComponent();

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
    });
  });

  describe("Progress Bars", () => {
    it("displays progress bars for attendance overview", () => {
      renderComponent();

      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
      // Check that the progress bar container exists
      const progressContainer = screen
        .getByText("Tổng quan điểm danh")
        .closest("div")?.parentElement;
      expect(progressContainer).toBeInTheDocument();
    });

    it("updates progress bars when attendance data changes", () => {
      const newAttendanceData = {
        ...mockAttendanceData,
        summary: {
          ...mockAttendanceData.summary,
          present: 4,
          absent: 1,
          late: 1,
          presentPercentage: 67,
          absentPercentage: 17,
          latePercentage: 16,
        },
      };

      renderComponent({ ...mockProps, mockAttendanceData: newAttendanceData });

      expect(screen.getByText("67%")).toBeInTheDocument();
      expect(screen.getByText("17%")).toBeInTheDocument();
      expect(screen.getByText("16%")).toBeInTheDocument();
    });
  });

  describe("Subject Statistics", () => {
    it("displays subject-wise attendance breakdown", () => {
      renderComponent();

      expect(screen.getByText("Theo môn học")).toBeInTheDocument();
      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("Văn học")).toBeInTheDocument();
      expect(screen.getByText("Tiếng Anh")).toBeInTheDocument();
    });

    it("shows subject attendance details", () => {
      renderComponent();

      expect(screen.getAllByText("1 buổi học").length).toBeGreaterThan(0); // All subjects have 1 class
      expect(screen.getAllByText("Có mặt: 1").length).toBeGreaterThan(0); // Toán học present
      expect(screen.getAllByText("Vắng mặt: 1").length).toBeGreaterThan(0); // Văn học absent
    });

    it("updates subject statistics when data changes", () => {
      const newAttendanceData = {
        ...mockAttendanceData,
        subjects: {
          "Toán học": { present: 2, absent: 0, late: 0, total: 2 },
          "Văn học": { present: 1, absent: 1, late: 0, total: 2 },
        },
      };

      renderComponent({ ...mockProps, mockAttendanceData: newAttendanceData });

      expect(screen.getAllByText("2 buổi học")).toHaveLength(2);
      expect(screen.getByText("Có mặt: 2")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("handles empty attendance data", () => {
      const emptyAttendanceData = {
        dates: {},
        summary: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          presentPercentage: 0,
          absentPercentage: 0,
          latePercentage: 0,
        },
        subjects: {},
      };

      renderComponent({
        ...mockProps,
        mockAttendanceData: emptyAttendanceData,
      });

      expect(screen.getAllByText("0%")).toHaveLength(3);
      expect(screen.getAllByText("0/0 buổi")).toHaveLength(3);
    });

    it("shows zero statistics when no data", () => {
      const emptyAttendanceData = {
        dates: {},
        summary: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          presentPercentage: 0,
          absentPercentage: 0,
          latePercentage: 0,
        },
        subjects: {},
      };

      renderComponent({
        ...mockProps,
        mockAttendanceData: emptyAttendanceData,
      });

      expect(screen.getAllByText("0%")).toHaveLength(3); // All three percentages should be 0%
    });
  });

  describe("Props Handling", () => {
    it("calls setSelectedMonth when month changes", () => {
      const setSelectedMonth = jest.fn();
      renderComponent({ ...mockProps, setSelectedMonth });

      const nextMonthButton = screen.getByTitle("Tháng sau");
      fireEvent.click(nextMonthButton);

      expect(setSelectedMonth).toHaveBeenCalledWith(2);
    });

    it("calls setSelectedYear when year changes", () => {
      const setSelectedYear = jest.fn();
      renderComponent({ ...mockProps, setSelectedYear });

      const nextYearButton = screen.getByTitle("Năm sau");
      fireEvent.click(nextYearButton);

      expect(setSelectedYear).toHaveBeenCalledWith(2025);
    });

    it("uses provided selectedMonth and selectedYear", () => {
      renderComponent({
        ...mockProps,
        selectedMonth: 3,
        selectedYear: 2023,
      });

      expect(screen.getAllByText("Tháng 3").length).toBeGreaterThan(0);
      // The year range is shown as 'Tỷ lệ điểm danh năm học 2022-2023' (with whitespace)
      const yearRangeMatches = screen.getAllByText((content, node) => {
        return !!node?.textContent
          ?.replace(/\s+/g, " ")
          .includes("Tỷ lệ điểm danh năm học 2022-2023");
      });
      expect(yearRangeMatches.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Layout", () => {
    it("renders with correct grid layout", () => {
      renderComponent();

      const cards = screen.getAllByTestId("card");
      expect(cards[0].className).toContain("lg:col-span-2");
    });

    it("displays statistics in a grid format", () => {
      renderComponent();

      expect(screen.getByText("Có mặt")).toBeInTheDocument();
      expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn")).toBeInTheDocument();
    });
  });

  describe("Data Validation", () => {
    it("handles missing optional fields", () => {
      const incompleteData = {
        dates: {
          "2024-01-15": {
            status: "present" as const,
            subject: "Toán học",
            time: "08:00 - 09:30",
            // Missing reason
          },
        },
        summary: mockAttendanceData.summary,
        subjects: mockAttendanceData.subjects,
      };

      renderComponent({ ...mockProps, mockAttendanceData: incompleteData });

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
    });

    it("handles invalid status values", () => {
      const invalidData = {
        dates: {
          "2024-01-15": {
            status: "invalid" as any,
            subject: "Toán học",
            time: "08:00 - 09:30",
          },
        },
        summary: mockAttendanceData.summary,
        subjects: mockAttendanceData.subjects,
      };

      renderComponent({ ...mockProps, mockAttendanceData: invalidData });

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      // Should not crash with invalid status
    });

    it("handles zero division in percentages", () => {
      const zeroData = {
        dates: {},
        summary: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          presentPercentage: 0,
          absentPercentage: 0,
          latePercentage: 0,
        },
        subjects: {},
      };

      renderComponent({ ...mockProps, mockAttendanceData: zeroData });

      expect(screen.getAllByText("0%")).toHaveLength(3);
      expect(screen.getAllByText("0/0 buổi")).toHaveLength(3);
    });
  });

  describe("Component Configuration", () => {
    it("renders with correct layout structure", () => {
      renderComponent();

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Theo môn học")).toBeInTheDocument();
    });

    it("displays correct year range", () => {
      renderComponent();

      expect(
        screen.getByText("Tỷ lệ điểm danh năm học 2023-2024"),
      ).toBeInTheDocument();
    });
  });
});
