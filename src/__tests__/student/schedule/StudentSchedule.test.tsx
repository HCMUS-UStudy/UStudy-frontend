import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentSchedule from "@/app/ui/components/user/student/schedule/StudentSchedule";
import { getPersonalClassSchedule } from "@/app/lib/services/classSchedule";

// Mock the service
jest.mock("@/app/lib/services/classSchedule", () => ({
  getPersonalClassSchedule: jest.fn(),
}));

// Mock react-calendar
jest.mock("react-calendar", () => {
  return function MockCalendar({
    onChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) {
    return (
      <div data-testid="calendar">
        <button
          data-testid="calendar-day"
          onClick={() => onChange(new Date("2024-01-15"))}
        >
          15
        </button>
        <button
          data-testid="calendar-day-with-task"
          onClick={() => onChange(new Date("2024-01-20"))}
        >
          20
        </button>
        <button
          data-testid="calendar-day-with-reminder"
          onClick={() => onChange(new Date("2024-01-25"))}
        >
          25
        </button>
        <button
          data-testid="calendar-day-both"
          onClick={() => onChange(new Date("2024-01-30"))}
        >
          30
        </button>
      </div>
    );
  };
});

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaMapMarkerAlt: () => <div data-testid="map-icon">Map Icon</div>,
  FaStickyNote: () => <div data-testid="note-icon">Note Icon</div>,
  FaClock: () => <div data-testid="clock-icon">Clock Icon</div>,
  FaChalkboardTeacher: () => <div data-testid="teacher-icon">Teacher Icon</div>,
  FaCheckCircle: () => <div data-testid="check-icon">Check Icon</div>,
  FaSpinner: () => <div data-testid="spinner-icon">Spinner Icon</div>,
}));

jest.mock("react-icons/fa6", () => ({
  FaBell: () => <div data-testid="bell-icon">Bell Icon</div>,
  FaBook: () => <div data-testid="book-icon">Book Icon</div>,
  FaRegClipboard: () => <div data-testid="clipboard-icon">Clipboard Icon</div>,
}));

// Mock Card components
jest.mock("@/app/ui/components/_common/Card", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardDescription: ({ children, className }: any) => (
    <div data-testid="card-description" className={className}>
      {children}
    </div>
  ),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockScheduleData = {
  data: {
    data: [
      {
        date: "2024-01-20",
        classSession: {
          clazz: {
            id: "1",
            name: "Lớp Toán 10A",
            course: { name: "Toán học" },
            grade: { name: "Lớp 10" },
            description: "Lớp Toán nâng cao",
          },
          session: {
            startTime: "08:00",
            endTime: "09:30",
          },
          room: {
            name: "Phòng 101",
          },
        },
      },
      {
        date: "2024-01-20",
        assignment: {
          title: "Bài tập về nhà số 1",
          endTime: "2024-01-20T23:59:00Z",
          clazz: {
            id: "1",
            name: "Lớp Toán 10A",
            course: { name: "Toán học" },
            grade: { name: "Lớp 10" },
          },
          format: "PDF",
          submitted: false,
        },
      },
      {
        date: "2024-01-25",
        classSession: {
          clazz: {
            id: "2",
            name: "Lớp Văn 10A",
            course: { name: "Ngữ văn" },
            grade: { name: "Lớp 10" },
            description: "Lớp Văn cơ bản",
          },
          session: {
            startTime: "10:00",
            endTime: "11:30",
          },
          room: {
            name: "Phòng 102",
          },
        },
      },
      {
        date: "2024-01-30",
        classSession: {
          clazz: {
            id: "3",
            name: "Lớp Anh 10A",
            course: { name: "Tiếng Anh" },
            grade: { name: "Lớp 10" },
            description: "Lớp Anh nâng cao",
          },
          session: {
            startTime: "14:00",
            endTime: "15:30",
          },
          room: {
            name: "Phòng 103",
          },
        },
      },
      {
        date: "2024-01-30",
        assignment: {
          title: "Bài tập về nhà số 2",
          endTime: "2024-01-30T23:59:00Z",
          clazz: {
            id: "3",
            name: "Lớp Anh 10A",
            course: { name: "Tiếng Anh" },
            grade: { name: "Lớp 10" },
          },
          format: "DOCX",
          submitted: true,
        },
      },
    ],
  },
};

describe("StudentSchedule", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 1)); // January 1, 2024
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (getPersonalClassSchedule as jest.Mock).mockResolvedValue(mockScheduleData);
  });

  it("renders the component with correct structure", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      expect(screen.getByTestId("calendar")).toBeInTheDocument();
      expect(screen.getByText("📅 Lịch học")).toBeInTheDocument();
      expect(screen.getByText("📖 Chi tiết lịch học")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    render(<StudentSchedule />);
    expect(screen.getAllByTestId("spinner-icon").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Đang tải lịch học...").length).toBeGreaterThan(
      0,
    );
  });

  it("fetches schedule data on mount", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      expect(getPersonalClassSchedule).toHaveBeenCalledWith(1, 2024);
    });
  });

  it("displays schedule details when a date with data is selected", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      expect(screen.getByTestId("calendar-day-with-task")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("calendar-day-with-task"));

    await waitFor(() => {
      expect(screen.getAllByText("Lớp học:")).toHaveLength(2);
      expect(screen.getAllByText("Lớp Toán 10A")).toHaveLength(2);
      expect(screen.getAllByText("Môn học:")).toHaveLength(2);
      expect(screen.getAllByText("Toán học - Lớp 10")).toHaveLength(2);
      expect(screen.getByText("Tiêu đề:")).toBeInTheDocument();
      expect(screen.getByText("Bài tập về nhà số 1")).toBeInTheDocument();
    });
  });

  it("displays task information correctly", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-task"));
    });

    await waitFor(() => {
      expect(screen.getByText("Hạn nộp:")).toBeInTheDocument();
      expect(screen.getByText("Bài tập pdf")).toBeInTheDocument();
      expect(screen.getByText("Chưa nộp bài")).toBeInTheDocument();
      expect(screen.getAllByText("Xem chi tiết")).toHaveLength(2);
    });
  });

  it("displays reminder information correctly", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-reminder"));
    });

    await waitFor(() => {
      expect(screen.getByText("Thời gian:")).toBeInTheDocument();
      expect(screen.getByText("10:00 - 11:30")).toBeInTheDocument();
      expect(screen.getByText("Địa điểm:")).toBeInTheDocument();
      expect(screen.getByText("Phòng 102")).toBeInTheDocument();
      expect(screen.getByText("Nhắc nhở ngày học")).toBeInTheDocument();
    });
  });

  it("displays both task and reminder for the same date", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-both"));
    });

    await waitFor(() => {
      expect(screen.getAllByText("Lớp Anh 10A")).toHaveLength(2);
      expect(screen.getAllByText("Tiếng Anh - Lớp 10")).toHaveLength(2);
      expect(screen.getByText("Bài tập về nhà số 2")).toBeInTheDocument();
      expect(screen.getByText("Đã nộp bài")).toBeInTheDocument();
    });
  });

  it("shows empty state when no schedule for selected date", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day"));
    });

    await waitFor(() => {
      expect(screen.getByText("😴")).toBeInTheDocument();
      expect(
        screen.getByText("Không có lịch học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("navigates to assignment page when clicking view details for task", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-task"));
    });

    await waitFor(() => {
      const viewDetailsButtons = screen.getAllByText("Xem chi tiết");
      fireEvent.click(viewDetailsButtons[1]);
    });

    expect(mockPush).toHaveBeenCalledWith("/member/classes/1/assignment");
  });

  it("navigates to overview page when clicking view details for reminder", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-reminder"));
    });

    await waitFor(() => {
      const viewDetailsButtons = screen.getAllByText("Xem chi tiết");
      fireEvent.click(viewDetailsButtons[0]);
    });

    expect(mockPush).toHaveBeenCalledWith("/member/classes/2/overview");
  });

  it("handles API error gracefully", async () => {
    (getPersonalClassSchedule as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    render(<StudentSchedule />);

    await waitFor(() => {
      expect(screen.getByText("😴")).toBeInTheDocument();
      expect(
        screen.getByText("Không có lịch học cho ngày này"),
      ).toBeInTheDocument();
    });
  });

  it("displays correct date format in description", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      const descriptions = screen.getAllByTestId("card-description");
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  it("shows legend for calendar icons", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      expect(screen.getByText("📘")).toBeInTheDocument();
      expect(screen.getByText("Bài học")).toBeInTheDocument();
      expect(screen.getByText("⏰")).toBeInTheDocument();
      expect(screen.getByText("Nhắc nhở")).toBeInTheDocument();
    });
  });

  it("renders with correct CSS classes", async () => {
    const { container } = render(<StudentSchedule />);

    await waitFor(() => {
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        "flex",
        "flex-col",
        "lg:flex-row",
        "gap-4",
        "lg:gap-8",
        "p-2",
        "md:p-4",
      );
    });
  });

  it("renders cards with correct styling", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      const cards = screen.getAllByTestId("card");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it("formats time correctly for tasks", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-task"));
    });

    await waitFor(() => {
      // Check if time is formatted correctly (should show time and date)
      expect(screen.getByText(/06:59/)).toBeInTheDocument();
    });
  });

  it("displays submitted status correctly", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-both"));
    });

    await waitFor(() => {
      expect(screen.getByText("Đã nộp bài")).toBeInTheDocument();
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });
  });

  it("displays not submitted status correctly", async () => {
    render(<StudentSchedule />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("calendar-day-with-task"));
    });

    await waitFor(() => {
      expect(screen.getByText("Chưa nộp bài")).toBeInTheDocument();
    });
  });
});
