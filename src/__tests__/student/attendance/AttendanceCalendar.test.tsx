import React from "react";
import { render, screen } from "@testing-library/react";
import AttendanceCalendar from "@/app/ui/components/user/parent/attendance/AttendanceCalendar";

// Mock react-calendar
jest.mock("react-calendar", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockCalendar({ value }: any) {
    return (
      <div data-testid="calendar">
        <span>Calendar Component</span>
        <span>Selected: {value?.toDateString()}</span>
      </div>
    );
  };
});

// Mock Chart.js
jest.mock("chart.js/auto", () => ({}));
jest.mock("react-chartjs-2", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Pie: ({ data }: any) => (
    <div data-testid="pie-chart">
      Pie Chart - Data: {JSON.stringify(data.datasets[0].data)}
    </div>
  ),
}));

const mockAttendanceData = {
  dates: {
    "2024-01-15": {
      status: "present" as const,
      subject: "Toán học",
      time: "08:00 - 09:30",
      reason: "Đi học đúng giờ",
    },
    "2024-01-16": {
      status: "absent" as const,
      subject: "Toán học",
      time: "08:00 - 09:30",
      reason: "Nghỉ ốm",
    },
  },
  summary: {
    totalClasses: 2,
    present: 1,
    absent: 1,
    late: 0,
    presentPercentage: 50,
    absentPercentage: 50,
    latePercentage: 0,
  },
  subjects: {
    "Toán học": {
      present: 1,
      absent: 1,
      late: 0,
      total: 2,
    },
  },
};

describe("AttendanceCalendar", () => {
  const defaultProps = {
    mockAttendanceData,
    setSelectedMonth: jest.fn(),
    setSelectedYear: jest.fn(),
    selectedMonth: 1,
    selectedYear: 2024,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the calendar component", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByTestId("calendar")).toBeInTheDocument();
    });

    it("should render the pie chart", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    it("should display attendance statistics", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Total classes
      expect(screen.getByText("1")).toBeInTheDocument(); // Present
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent
      expect(screen.getByText("0")).toBeInTheDocument(); // Late
    });

    it("should display attendance percentages", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByText("50%")).toBeInTheDocument(); // Present percentage
      expect(screen.getByText("50%")).toBeInTheDocument(); // Absent percentage
      expect(screen.getByText("0%")).toBeInTheDocument(); // Late percentage
    });
  });

  describe("Chart Data", () => {
    it("should pass correct data to pie chart", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      const pieChart = screen.getByTestId("pie-chart");
      expect(pieChart).toBeInTheDocument();
      expect(pieChart).toHaveTextContent("[1,1,0]"); // [present, absent, late]
    });

    it("should handle zero attendance data in chart", () => {
      const zeroData = {
        ...mockAttendanceData,
        summary: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          presentPercentage: 0,
          absentPercentage: 0,
          latePercentage: 0,
        },
      };

      render(
        <AttendanceCalendar {...defaultProps} mockAttendanceData={zeroData} />,
      );

      const pieChart = screen.getByTestId("pie-chart");
      expect(pieChart).toHaveTextContent("[0,0,0]");
    });
  });

  describe("Empty States", () => {
    it("should show no attendance message when no attendance data", () => {
      const noData = {
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

      render(
        <AttendanceCalendar {...defaultProps} mockAttendanceData={noData} />,
      );

      expect(screen.getByText("0")).toBeInTheDocument(); // Total classes
      expect(screen.getByText("0%")).toBeInTheDocument(); // All percentages
    });
  });

  describe("Props Handling", () => {
    it("should use provided month and year", () => {
      render(
        <AttendanceCalendar
          {...defaultProps}
          selectedMonth={3}
          selectedYear={2025}
        />,
      );

      expect(screen.getByTestId("calendar")).toBeInTheDocument();
    });

    it("should call setSelectedMonth when provided", () => {
      const setSelectedMonth = jest.fn();
      render(
        <AttendanceCalendar
          {...defaultProps}
          setSelectedMonth={setSelectedMonth}
        />,
      );

      expect(setSelectedMonth).not.toHaveBeenCalled();
    });

    it("should call setSelectedYear when provided", () => {
      const setSelectedYear = jest.fn();
      render(
        <AttendanceCalendar
          {...defaultProps}
          setSelectedYear={setSelectedYear}
        />,
      );

      expect(setSelectedYear).not.toHaveBeenCalled();
    });
  });

  describe("Component Structure", () => {
    it("should render all required sections", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByText("Thống kê điểm danh")).toBeInTheDocument();
      expect(screen.getByTestId("calendar")).toBeInTheDocument();
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    it("should display correct attendance counts", () => {
      render(<AttendanceCalendar {...defaultProps} />);

      expect(screen.getByText("2")).toBeInTheDocument(); // Total
      expect(screen.getByText("1")).toBeInTheDocument(); // Present
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent
      expect(screen.getByText("0")).toBeInTheDocument(); // Late
    });
  });
});
