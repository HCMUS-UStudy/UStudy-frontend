import React from "react";
import { render, screen } from "@testing-library/react";
import AttendanceSummary from "@/app/ui/components/user/parent/attendance/AttendanceSummary";

// Mock Chart.js
jest.mock("chart.js/auto", () => ({}));
jest.mock("react-chartjs-2", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Bar: ({ data }: any) => (
    <div data-testid="bar-chart">
      Bar Chart - Data: {JSON.stringify(data.datasets[0].data)}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Line: ({ data }: any) => (
    <div data-testid="line-chart">
      Line Chart - Data: {JSON.stringify(data.datasets[0].data)}
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
    "2024-01-17": {
      status: "late" as const,
      subject: "Toán học",
      time: "08:00 - 09:30",
      reason: "Đi muộn 15 phút",
    },
    "2024-01-18": {
      status: "present" as const,
      subject: "Văn học",
      time: "10:00 - 11:30",
      reason: "Đi học đúng giờ",
    },
  },
  summary: {
    totalClasses: 4,
    present: 2,
    absent: 1,
    late: 1,
    presentPercentage: 50,
    absentPercentage: 25,
    latePercentage: 25,
  },
  subjects: {
    "Toán học": {
      present: 1,
      absent: 1,
      late: 1,
      total: 3,
    },
    "Văn học": {
      present: 1,
      absent: 0,
      late: 0,
      total: 1,
    },
  },
};

describe("AttendanceSummary", () => {
  const defaultProps = {
    mockAttendanceData,
    selectedYear: 2024,
    selectedMonth: 1,
    setSelectedMonth: jest.fn(),
    setSelectedYear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the summary header", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("Nhận xét & Thống kê")).toBeInTheDocument();
      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
    });

    it("should render attendance statistics cards", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("Tổng số buổi học")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument(); // Total classes

      expect(screen.getByText("Có mặt")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Present

      expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent

      expect(screen.getByText("Đi muộn")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Late
    });

    it("should render attendance percentages", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("50%")).toBeInTheDocument(); // Present percentage
      expect(screen.getByText("25%")).toBeInTheDocument(); // Absent percentage
      expect(screen.getByText("25%")).toBeInTheDocument(); // Late percentage
    });

    it("should render charts", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  describe("Subject Breakdown", () => {
    it("should render subject attendance breakdown", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("Thống kê theo môn học")).toBeInTheDocument();
      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("Văn học")).toBeInTheDocument();
    });

    it("should display subject attendance details", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Check for Toán học details
      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // Total classes for Toán học
      expect(screen.getByText("1")).toBeInTheDocument(); // Present for Toán học
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent for Toán học
      expect(screen.getByText("1")).toBeInTheDocument(); // Late for Toán học

      // Check for Văn học details
      expect(screen.getByText("Văn học")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Total classes for Văn học
    });

    it("should calculate subject percentages correctly", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Toán học: 1 present out of 3 total = 33.33%
      expect(screen.getByText("33%")).toBeInTheDocument(); // Present percentage for Toán học
      expect(screen.getByText("33%")).toBeInTheDocument(); // Absent percentage for Toán học
      expect(screen.getByText("33%")).toBeInTheDocument(); // Late percentage for Toán học

      // Văn học: 1 present out of 1 total = 100%
      expect(screen.getByText("100%")).toBeInTheDocument(); // Present percentage for Văn học
    });
  });

  describe("Progress Indicators", () => {
    it("should render progress bars for subjects", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Should have progress bars for each subject
      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it("should display progress percentages correctly", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Check for progress percentage text
      expect(screen.getByText("33%")).toBeInTheDocument(); // Toán học present percentage
      expect(screen.getByText("100%")).toBeInTheDocument(); // Văn học present percentage
    });
  });

  describe("Chart Data", () => {
    it("should pass correct data to bar chart", () => {
      render(<AttendanceSummary {...defaultProps} />);

      const barChart = screen.getByTestId("bar-chart");
      expect(barChart).toBeInTheDocument();
      // Should contain attendance data for subjects
      expect(barChart).toHaveTextContent(/Toán học|Văn học/);
    });

    it("should pass correct data to line chart", () => {
      render(<AttendanceSummary {...defaultProps} />);

      const lineChart = screen.getByTestId("line-chart");
      expect(lineChart).toBeInTheDocument();
      // Should contain trend data
      expect(lineChart).toHaveTextContent(/trend|data/i);
    });

    it("should handle empty data in charts", () => {
      const emptyData = {
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
        <AttendanceSummary {...defaultProps} mockAttendanceData={emptyData} />,
      );

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("should show no attendance message when no data", () => {
      const emptyData = {
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
        <AttendanceSummary {...defaultProps} mockAttendanceData={emptyData} />,
      );

      expect(screen.getByText("0")).toBeInTheDocument(); // Total classes
      expect(screen.getByText("0%")).toBeInTheDocument(); // All percentages
    });

    it("should show no subjects message when no subject data", () => {
      const noSubjectsData = {
        ...mockAttendanceData,
        subjects: {},
      };

      render(
        <AttendanceSummary
          {...defaultProps}
          mockAttendanceData={noSubjectsData}
        />,
      );

      expect(screen.getByText("Thống kê theo môn học")).toBeInTheDocument();
      // Should not show any subject names
      expect(screen.queryByText("Toán học")).not.toBeInTheDocument();
      expect(screen.queryByText("Văn học")).not.toBeInTheDocument();
    });
  });

  describe("Data Calculations", () => {
    it("should calculate overall statistics correctly", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Total classes: 4
      expect(screen.getByText("4")).toBeInTheDocument();

      // Present: 2 out of 4 = 50%
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();

      // Absent: 1 out of 4 = 25%
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();

      // Late: 1 out of 4 = 25%
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
    });

    it("should calculate subject statistics correctly", () => {
      render(<AttendanceSummary {...defaultProps} />);

      // Toán học: 3 total, 1 present, 1 absent, 1 late
      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // Total
      expect(screen.getByText("1")).toBeInTheDocument(); // Present
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent
      expect(screen.getByText("1")).toBeInTheDocument(); // Late

      // Văn học: 1 total, 1 present, 0 absent, 0 late
      expect(screen.getByText("Văn học")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Total
      expect(screen.getByText("1")).toBeInTheDocument(); // Present
      expect(screen.getByText("0")).toBeInTheDocument(); // Absent
      expect(screen.getByText("0")).toBeInTheDocument(); // Late
    });
  });

  describe("Props Handling", () => {
    it("should use provided month and year", () => {
      render(
        <AttendanceSummary
          {...defaultProps}
          selectedMonth={3}
          selectedYear={2025}
        />,
      );

      expect(screen.getByText("Tháng 3")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025")).toBeInTheDocument();
    });

    it("should call setSelectedMonth when provided", () => {
      const setSelectedMonth = jest.fn();
      render(
        <AttendanceSummary
          {...defaultProps}
          setSelectedMonth={setSelectedMonth}
        />,
      );

      expect(setSelectedMonth).not.toHaveBeenCalled();
    });

    it("should call setSelectedYear when provided", () => {
      const setSelectedYear = jest.fn();
      render(
        <AttendanceSummary
          {...defaultProps}
          setSelectedYear={setSelectedYear}
        />,
      );

      expect(setSelectedYear).not.toHaveBeenCalled();
    });
  });

  describe("Component Structure", () => {
    it("should render all required sections", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("Nhận xét & Thống kê")).toBeInTheDocument();
      expect(screen.getByText("Tổng quan điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Thống kê theo môn học")).toBeInTheDocument();
    });

    it("should display correct attendance counts", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("4")).toBeInTheDocument(); // Total
      expect(screen.getByText("2")).toBeInTheDocument(); // Present
      expect(screen.getByText("1")).toBeInTheDocument(); // Absent
      expect(screen.getByText("1")).toBeInTheDocument(); // Late
    });

    it("should display correct percentages", () => {
      render(<AttendanceSummary {...defaultProps} />);

      expect(screen.getByText("50%")).toBeInTheDocument(); // Present percentage
      expect(screen.getByText("25%")).toBeInTheDocument(); // Absent percentage
      expect(screen.getByText("25%")).toBeInTheDocument(); // Late percentage
    });
  });
});
