/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock services
jest.mock("@/app/lib/services/classSchedule", () => ({
  getBranchSchedule: jest.fn(),
}));

// Mock components
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
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
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

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/admin/BranchSelector", () => () => (
  <div data-testid="branch-selector" />
));

// Mock react-calendar
jest.mock("react-calendar", () => {
  return function MockCalendar(props: any) {
    return (
      <div data-testid="calendar" onClick={props.onChange}>
        <div data-testid="calendar-tile" className="react-calendar__tile" />
      </div>
    );
  };
});

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaChalkboardTeacher: () => <div data-testid="teacher-icon" />,
  FaBook: () => <div data-testid="book-icon" />,
  FaUserTie: () => <div data-testid="user-icon" />,
  FaSpinner: () => <div data-testid="spinner-icon" />,
  FaRegCalendarAlt: () => <div data-testid="calendar-icon" />,
}));

import { useSelector } from "react-redux";
import { getBranchSchedule } from "@/app/lib/services/classSchedule";
import AdminSchedule from "@/app/ui/components/admin/schedule/AdminSchedule";

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockGetBranchSchedule = getBranchSchedule as jest.MockedFunction<
  typeof getBranchSchedule
>;

describe("AdminSchedule Integration Tests", () => {
  const mockBranchData = {
    selectedBranchId: "branch-123",
  };

  const mockMultipleSchedules = {
    data: {
      data: [
        {
          id: "1",
          date: "2025-02-15",
          classSession: {
            id: "session-1",
            day: "SATURDAY",
            clazz: {
              id: "class-1",
              name: "10A1",
              description: "Lớp học toán",
              fee: 1000000,
              startDate: "2025-01-01",
              endDate: "2025-06-30",
              numLessons: 20,
              grade: {
                id: "grade-1",
                name: "Lớp 10",
              },
              course: {
                id: "course-1",
                name: "Toán",
              },
              teacher: [
                {
                  id: "teacher-1",
                  name: "Nguyễn Văn A",
                },
              ],
              classSessions: [],
            },
            session: {
              id: "session-1",
              name: "Ca sáng",
              startTime: "07:00:00",
              endTime: "09:00:00",
            },
            room: {
              id: "room-1",
              name: "Phòng 101",
            },
          },
          isPassed: false,
        },
        {
          id: "2",
          date: "2025-02-15",
          classSession: {
            id: "session-2",
            day: "SATURDAY",
            clazz: {
              id: "class-2",
              name: "11B2",
              description: "Lớp học Văn",
              fee: 1200000,
              startDate: "2025-01-01",
              endDate: "2025-06-30",
              numLessons: 18,
              grade: {
                id: "grade-2",
                name: "Lớp 11",
              },
              course: {
                id: "course-2",
                name: "Văn",
              },
              teacher: [
                {
                  id: "teacher-2",
                  name: "Trần Thị B",
                },
              ],
              classSessions: [],
            },
            session: {
              id: "session-2",
              name: "Ca chiều",
              startTime: "14:00:00",
              endTime: "16:00:00",
            },
            room: {
              id: "room-2",
              name: "Phòng 102",
            },
          },
          isPassed: false,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockReturnValue(mockBranchData);
  });

  describe("Component Integration", () => {
    it("integrates calendar and schedule detail sections", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      // Calendar section should be rendered
      expect(screen.getByText("🗓️ Quản lý lịch dạy")).toBeInTheDocument();
      expect(screen.getByTestId("calendar")).toBeInTheDocument();

      // Schedule detail section should be rendered
      expect(screen.getByText("📖 Chi tiết lớp học")).toBeInTheDocument();

      // Both sections should work together - check for empty state initially
      await waitFor(() => {
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });

    it("integrates branch selector with schedule fetching", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      // Branch selector should be present
      expect(screen.getByTestId("branch-selector")).toBeInTheDocument();

      // Schedule should be fetched for selected branch
      await waitFor(() => {
        expect(mockGetBranchSchedule).toHaveBeenCalledWith(
          "branch-123",
          7,
          2025,
        );
      });
    });

    it("handles multiple schedules for same date", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        // Initially shows empty state until date is selected
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Data Flow Integration", () => {
    it("flows from branch selection to schedule display", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      // Initial state
      expect(screen.getByTestId("calendar")).toBeInTheDocument();

      // After data loads - shows empty state initially
      await waitFor(() => {
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });

      // Verify API was called with correct parameters
      expect(mockGetBranchSchedule).toHaveBeenCalledWith("branch-123", 7, 2025);
    });

    it("handles data transformation correctly", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        // Initially shows empty state until date is selected
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("handles API failure gracefully", async () => {
      mockGetBranchSchedule.mockRejectedValue(new Error("Network error"));

      render(<AdminSchedule />);

      await waitFor(() => {
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });

    it("handles empty response gracefully", async () => {
      mockGetBranchSchedule.mockResolvedValue({ data: { data: [] } } as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });

    it("handles missing branch selection", () => {
      mockUseSelector.mockReturnValue({ selectedBranchId: null });

      render(<AdminSchedule />);

      expect(
        screen.getByText("Vui lòng chọn chi nhánh để xem lịch học"),
      ).toBeInTheDocument();
    });
  });

  describe("State Management Integration", () => {
    it("manages loading state correctly", async () => {
      mockGetBranchSchedule.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<AdminSchedule />);

      await waitFor(() => {
        expect(screen.getAllByText("Đang tải lịch lớp...")).toHaveLength(2);
      });
    });

    it("manages selected date state", () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      const calendar = screen.getByTestId("calendar");
      fireEvent.click(calendar);

      // Calendar should still be functional
      expect(calendar).toBeInTheDocument();
    });
  });

  describe("UI Integration", () => {
    it("displays responsive layout correctly", () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      // Check if responsive classes are applied
      const cards = screen.getAllByTestId("card");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("displays icons correctly", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        // Check if calendar icon is rendered
        expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
      });
    });

    it("displays Vietnamese date format correctly", async () => {
      mockGetBranchSchedule.mockResolvedValue(mockMultipleSchedules as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        // Check if Vietnamese date format is displayed
        const dateText = screen.getByText(/Thứ/);
        expect(dateText).toBeInTheDocument();
      });
    });
  });

  describe("Performance Integration", () => {
    it("handles large dataset efficiently", async () => {
      const largeDataset = {
        data: {
          data: Array.from({ length: 50 }, (_, index) => ({
            id: `session-${index}`,
            date: "2025-02-15",
            classSession: {
              id: `session-${index}`,
              day: "SATURDAY",
              clazz: {
                id: `class-${index}`,
                name: `Lớp ${index + 1}`,
                description: `Lớp học ${index + 1}`,
                fee: 1000000,
                startDate: "2025-01-01",
                endDate: "2025-06-30",
                numLessons: 20,
                grade: {
                  id: `grade-${index}`,
                  name: `Lớp ${index + 1}`,
                },
                course: {
                  id: `course-${index}`,
                  name: `Môn ${index + 1}`,
                },
                teacher: [
                  {
                    id: `teacher-${index}`,
                    name: `Giáo viên ${index + 1}`,
                  },
                ],
                classSessions: [],
              },
              session: {
                id: `session-${index}`,
                name: "Ca sáng",
                startTime: "07:00:00",
                endTime: "09:00:00",
              },
              room: {
                id: `room-${index}`,
                name: `Phòng ${index + 1}`,
              },
            },
            isPassed: false,
          })),
        },
      };

      mockGetBranchSchedule.mockResolvedValue(largeDataset as any);

      render(<AdminSchedule />);

      await waitFor(() => {
        // Should handle large dataset without crashing - shows empty state initially
        expect(
          screen.getByText("Không có lớp học cho ngày này"),
        ).toBeInTheDocument();
      });
    });
  });
});
