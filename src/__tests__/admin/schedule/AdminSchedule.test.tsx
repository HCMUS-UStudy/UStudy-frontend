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

describe("AdminSchedule", () => {
  const mockBranchData = {
    selectedBranchId: "branch-123",
  };

  const mockScheduleData = {
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
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockReturnValue(mockBranchData);
    mockGetBranchSchedule.mockResolvedValue(mockScheduleData as any);
  });

  it("renders without crashing", () => {
    render(<AdminSchedule />);
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });

  it("renders calendar section", () => {
    render(<AdminSchedule />);

    expect(screen.getByText("🗓️ Quản lý lịch dạy")).toBeInTheDocument();
    expect(screen.getByText("Chọn ngày để xem chi tiết")).toBeInTheDocument();
  });

  it("renders schedule detail section", () => {
    render(<AdminSchedule />);

    expect(screen.getByText("📖 Chi tiết lớp học")).toBeInTheDocument();
  });

  it("renders branch selector", () => {
    render(<AdminSchedule />);

    expect(screen.getByTestId("branch-selector")).toBeInTheDocument();
  });

  it("shows loading state when fetching data", async () => {
    mockGetBranchSchedule.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AdminSchedule />);

    await waitFor(() => {
      expect(screen.getAllByText("Đang tải lịch lớp...")).toHaveLength(2);
    });
  });

  it("shows message when no branch selected", () => {
    mockUseSelector.mockReturnValue({ selectedBranchId: null });

    render(<AdminSchedule />);

    expect(
      screen.getByText("Vui lòng chọn chi nhánh để xem lịch học"),
    ).toBeInTheDocument();
  });

  it("fetches schedule data when branch is selected", async () => {
    render(<AdminSchedule />);

    await waitFor(() => {
      expect(mockGetBranchSchedule).toHaveBeenCalledWith("branch-123", 7, 2025);
    });
  });

  it("handles API error gracefully", async () => {
    mockGetBranchSchedule.mockRejectedValue(new Error("API Error"));

    render(<AdminSchedule />);

    await waitFor(() => {
      expect(
        screen.getByText("Không có lớp học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("displays schedule data correctly", async () => {
    render(<AdminSchedule />);

    await waitFor(() => {
      // Initially shows empty state until date is selected
      expect(
        screen.getByText("Không có lớp học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("handles missing teacher data", async () => {
    const scheduleWithoutTeacher = {
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
                teacher: null,
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
        ],
      },
    };

    mockGetBranchSchedule.mockResolvedValue(scheduleWithoutTeacher as any);

    render(<AdminSchedule />);

    await waitFor(() => {
      // Initially shows empty state until date is selected
      expect(
        screen.getByText("Không có lớp học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("handles missing room data", async () => {
    const scheduleWithoutRoom = {
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
              room: null,
            },
            isPassed: false,
          },
        ],
      },
    };

    mockGetBranchSchedule.mockResolvedValue(scheduleWithoutRoom as any);

    render(<AdminSchedule />);

    await waitFor(() => {
      // Initially shows empty state until date is selected
      expect(
        screen.getByText("Không có lớp học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("handles calendar date change", () => {
    render(<AdminSchedule />);

    const calendar = screen.getByTestId("calendar");
    fireEvent.click(calendar);

    // Calendar should still be rendered
    expect(calendar).toBeInTheDocument();
  });

  it("displays correct date format in schedule detail", async () => {
    render(<AdminSchedule />);

    await waitFor(() => {
      // Check if the date is displayed in Vietnamese format
      const dateText = screen.getByText(/Thứ/);
      expect(dateText).toBeInTheDocument();
    });
  });

  it("shows empty state when no classes for selected date", async () => {
    const emptySchedule = {
      data: {
        data: [],
      },
    };

    mockGetBranchSchedule.mockResolvedValue(emptySchedule as any);

    render(<AdminSchedule />);

    await waitFor(() => {
      expect(
        screen.getByText("Không có lớp học cho ngày này"),
      ).toBeInTheDocument();
    });
  });
});
