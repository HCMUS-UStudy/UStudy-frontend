import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassDetailPage from "@/app/(admin)/admin/classes/[classId]/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ classId: "test-class-id" }),
}));

// Mock the useEncodedRoute hook
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({
    decodeId: (id: string) => id,
  }),
}));

// Mock the services
jest.mock("@/app/lib/services/class", () => ({
  getClassById: jest.fn(),
}));

jest.mock("@/app/lib/services/classSchedule", () => ({
  getClassSchedule: jest.fn(),
}));

// Mock the Button component
jest.mock("@/app/ui/components/_common/Button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => {
    return (
      <button
        data-testid="custom-button"
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    );
  },
}));

// Mock the Loading component
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  const MockLoading = () => {
    return <div data-testid="loading">Loading...</div>;
  };
  MockLoading.displayName = "Loading";
  return MockLoading;
});

// Mock the AddingModal component
jest.mock("@/app/ui/components/user/teacher/AddingModal", () => {
  return function MockAddingModal({
    classDetail,
    setAddingModal,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classDetail: any;
    setAddingModal: (value: boolean) => void;
  }) {
    return (
      <div data-testid="adding-modal">
        <button onClick={() => setAddingModal(false)}>Close Modal</button>
        <span>Modal for class: {classDetail?.name}</span>
      </div>
    );
  };
});

const mockClassDetail = {
  id: "test-class-id",
  name: "Test Class",
  description: "This is a test class",
  course: { name: "Mathematics" },
  grade: { name: "Grade 10" },
  startDate: "2024-01-01",
  endDate: "2024-06-30",
  status: "PROGRESS",
};

const mockClassSchedule = [
  {
    id: "schedule-1",
    date: "2024-01-15",
    isPassed: true,
    classSession: {
      id: "session-1",
      day: "MONDAY",
      session: {
        id: "time-1",
        name: "Morning Session",
        startTime: "08:00:00",
        endTime: "09:30:00",
      },
      room: {
        id: "room-1",
        name: "Room 101",
      },
    },
  },
  {
    id: "schedule-2",
    date: "2024-01-22",
    isPassed: false,
    classSession: {
      id: "session-2",
      day: "TUESDAY",
      session: {
        id: "time-2",
        name: "Afternoon Session",
        startTime: "14:00:00",
        endTime: "15:30:00",
      },
      room: {
        id: "room-2",
        name: "Room 102",
      },
    },
  },
];

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("Class Detail Page", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockGetClassById = require("@/app/lib/services/class").getClassById;
  const mockGetClassSchedule =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/app/lib/services/classSchedule").getClassSchedule;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders class details after loading", async () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Class")).toBeInTheDocument();
    });

    expect(screen.getByText("This is a test class")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Grade 10")).toBeInTheDocument();
    expect(screen.getByText("Đang diễn ra")).toBeInTheDocument();
  });

  it("renders schedule items correctly", async () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Thứ hai")).toBeInTheDocument();
    });

    expect(screen.getByText("Thứ ba")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Room 101")),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Room 102")),
    ).toBeInTheDocument();
    expect(screen.getByText("Đã hoàn thành")).toBeInTheDocument();
    expect(screen.getByText("Chưa hoàn thành")).toBeInTheDocument();
  });

  it("opens adding modal when button is clicked", async () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });

    const addButton = screen.getByTestId("custom-button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("adding-modal")).toBeInTheDocument();
    });
  });

  it("shows 'show all' button when there are more schedules", async () => {
    const longSchedule = Array.from({ length: 10 }, (_, i) => ({
      ...mockClassSchedule[0],
      id: `schedule-${i}`,
      date: `2024-01-${15 + i}`,
    }));

    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(longSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Xem tất cả")).toBeInTheDocument();
    });
  });

  it("shows 'collapse' button when all schedules are displayed", async () => {
    const longSchedule = Array.from({ length: 10 }, (_, i) => ({
      ...mockClassSchedule[0],
      id: `schedule-${i}`,
      date: `2024-01-${15 + i}`,
    }));

    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(longSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Xem tất cả")).toBeInTheDocument();
    });

    const showAllButton = screen.getByText("Xem tất cả");
    fireEvent.click(showAllButton);

    await waitFor(() => {
      expect(screen.getByText("Thu gọn")).toBeInTheDocument();
    });
  });

  it("handles different class statuses correctly", async () => {
    const openClass = { ...mockClassDetail, status: "OPEN" };
    const completedClass = { ...mockClassDetail, status: "COMPLETED" };

    mockGetClassById.mockResolvedValue(openClass);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    const { rerender } = renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Chưa bắt đầu")).toBeInTheDocument();
    });

    mockGetClassById.mockResolvedValue(completedClass);
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ClassDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Đã hoàn thành")).toBeInTheDocument();
    });
  });

  it("shows empty state when no schedule exists", async () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(null);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Chưa có buổi học nào.")).toBeInTheDocument();
    });
  });

  it("formats dates correctly", async () => {
    mockGetClassById.mockResolvedValue(mockClassDetail);
    mockGetClassSchedule.mockResolvedValue(mockClassSchedule);

    renderWithQueryClient(<ClassDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/30\/06\/2024/)).toBeInTheDocument();
    });
  });
});
