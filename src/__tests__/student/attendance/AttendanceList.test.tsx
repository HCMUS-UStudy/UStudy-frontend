import React from "react";
import { render, screen } from "@testing-library/react";
import AttendanceList from "@/app/ui/components/user/parent/attendance/AttendanceList";

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
  },
  summary: {
    totalClasses: 3,
    present: 1,
    absent: 1,
    late: 1,
    presentPercentage: 33,
    absentPercentage: 33,
    latePercentage: 34,
  },
  subjects: {
    "Toán học": {
      present: 1,
      absent: 1,
      late: 1,
      total: 3,
    },
  },
};

describe("AttendanceList", () => {
  const defaultProps = {
    mockAttendanceData,
    selectedMonth: 1,
    selectedYear: 2024,
    setSelectedMonth: jest.fn(),
    setSelectedYear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the attendance list header", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Danh sách điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Chọn thời gian:")).toBeInTheDocument();
    });

    it("should render month and year selection controls", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Tháng 1")).toBeInTheDocument();
      expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("should render attendance records", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("08:00 - 09:30")).toBeInTheDocument();
      expect(screen.getByText("Đi học đúng giờ")).toBeInTheDocument();
      expect(screen.getByText("Nghỉ ốm")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn 15 phút")).toBeInTheDocument();
    });
  });

  describe("Attendance Status Display", () => {
    it("should display present status correctly", () => {
      render(<AttendanceList {...defaultProps} />);

      const presentBadge = screen.getByText("Có mặt");
      expect(presentBadge).toBeInTheDocument();
      expect(presentBadge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("should display absent status correctly", () => {
      render(<AttendanceList {...defaultProps} />);

      const absentBadge = screen.getByText("Vắng mặt");
      expect(absentBadge).toBeInTheDocument();
      expect(absentBadge).toHaveClass("bg-red-100", "text-red-800");
    });

    it("should display late status correctly", () => {
      render(<AttendanceList {...defaultProps} />);

      const lateBadge = screen.getByText("Đi muộn");
      expect(lateBadge).toBeInTheDocument();
      expect(lateBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });
  });

  describe("Date Formatting", () => {
    it("should format dates correctly", () => {
      render(<AttendanceList {...defaultProps} />);

      // Check for formatted dates (15/01/2024, 16/01/2024, 17/01/2024)
      expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/16\/01\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/17\/01\/2024/)).toBeInTheDocument();
    });

    it("should display day of week correctly", () => {
      render(<AttendanceList {...defaultProps} />);

      // Check for day of week (Thứ Hai, Thứ Ba, etc.)
      expect(screen.getByText(/Thứ/)).toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("should show no attendance message when no data for selected month", () => {
      const emptyData = {
        ...mockAttendanceData,
        dates: {},
      };

      render(
        <AttendanceList {...defaultProps} mockAttendanceData={emptyData} />,
      );

      expect(screen.getByText("Không có điểm danh")).toBeInTheDocument();
      expect(
        screen.getByText("Không có thông tin điểm danh cho tháng này"),
      ).toBeInTheDocument();
    });

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

      render(<AttendanceList {...defaultProps} mockAttendanceData={noData} />);

      expect(screen.getByText("Không có điểm danh")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should use provided month and year", () => {
      render(
        <AttendanceList
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
        <AttendanceList
          {...defaultProps}
          setSelectedMonth={setSelectedMonth}
        />,
      );

      expect(setSelectedMonth).not.toHaveBeenCalled();
    });

    it("should call setSelectedYear when provided", () => {
      const setSelectedYear = jest.fn();
      render(
        <AttendanceList {...defaultProps} setSelectedYear={setSelectedYear} />,
      );

      expect(setSelectedYear).not.toHaveBeenCalled();
    });
  });

  describe("Component Structure", () => {
    it("should render all required sections", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Danh sách điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Chọn thời gian:")).toBeInTheDocument();
      expect(screen.getByText("Tháng 1")).toBeInTheDocument();
      expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("should display attendance records with correct data", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Toán học")).toBeInTheDocument();
      expect(screen.getByText("08:00 - 09:30")).toBeInTheDocument();
      expect(screen.getByText("Đi học đúng giờ")).toBeInTheDocument();
      expect(screen.getByText("Nghỉ ốm")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn 15 phút")).toBeInTheDocument();
    });

    it("should display correct attendance statuses", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Có mặt")).toBeInTheDocument();
      expect(screen.getByText("Vắng mặt")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn")).toBeInTheDocument();
    });
  });

  describe("Data Display", () => {
    it("should display subject information", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Toán học")).toBeInTheDocument();
    });

    it("should display time information", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("08:00 - 09:30")).toBeInTheDocument();
    });

    it("should display reason information", () => {
      render(<AttendanceList {...defaultProps} />);

      expect(screen.getByText("Đi học đúng giờ")).toBeInTheDocument();
      expect(screen.getByText("Nghỉ ốm")).toBeInTheDocument();
      expect(screen.getByText("Đi muộn 15 phút")).toBeInTheDocument();
    });
  });
});
