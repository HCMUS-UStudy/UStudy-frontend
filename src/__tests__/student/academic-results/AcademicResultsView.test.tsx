import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import AcademicResultsView from "@/app/ui/components/user/student/academic-results/AcademicResultsView";
import {
  getAllClassScores,
  getClassScoreDetail,
} from "@/app/lib/services/class";

// Mock the services
jest.mock("@/app/lib/services/class", () => ({
  getAllClassScores: jest.fn(),
  getClassScoreDetail: jest.fn(),
}));

// Mock Chart.js
jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  RadialLinearScale: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));

// Mock the child components
jest.mock("@/app/ui/components/user/student/academic-results/Header", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Header: ({}: any) => <div data-testid="header">Header Component</div>,
}));

jest.mock(
  "@/app/ui/components/user/student/academic-results/SubjectScoreChart",
  () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SubjectScoreChart: ({}: any) => (
      <div data-testid="subject-score-chart">Subject Score Chart</div>
    ),
  }),
);

jest.mock(
  "@/app/ui/components/user/student/academic-results/ProgressChart",
  () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ProgressChart: ({}: any) => (
      <div data-testid="progress-chart">Progress Chart</div>
    ),
  }),
);

jest.mock(
  "@/app/ui/components/user/student/academic-results/SkillChart",
  () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SkillChart: ({}: any) => <div data-testid="skill-chart">Skill Chart</div>,
  }),
);

jest.mock(
  "@/app/ui/components/user/student/academic-results/DetailedScoresTable",
  () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockDetailedScoresTable({}: any) {
      return (
        <div data-testid="detailed-scores-table">Detailed Scores Table</div>
      );
    };
  },
);

jest.mock(
  "@/app/ui/components/user/student/academic-results/AcademicResultsSkeleton",
  () => ({
    AcademicResultsSkeleton: () => (
      <div data-testid="academic-results-skeleton">Loading...</div>
    ),
  }),
);

jest.mock(
  "@/app/ui/components/user/student/academic-results/MessageCard",
  () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MessageCard: ({ message }: any) => (
      <div data-testid="message-card">{message}</div>
    ),
  }),
);

// Mock Tabs component
jest.mock("@/app/ui/components/_common/Tabs", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Tabs: ({ children, value }: any) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TabList: ({ children, className }: any) => (
    <div data-testid="tab-list" className={className}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Tab: ({ label, value }: any) => (
    <button data-testid={`tab-${value}`} data-value={value}>
      {label}
    </button>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TabPanel: ({ children, value }: any) => (
    <div data-testid={`tab-panel-${value}`} data-value={value}>
      {children}
    </div>
  ),
}));

const mockAllScores = [
  {
    classId: "1",
    className: "Lớp Toán 10A",
    course: { name: "Toán học" },
    grade: { name: "Lớp 10" },
    studentAverage: 8.5,
    classAverage: 7.8,
    studentRank: 3,
    totalStudents: 30,
  },
  {
    classId: "2",
    className: "Lớp Văn 10A",
    course: { name: "Ngữ văn" },
    grade: { name: "Lớp 10" },
    studentAverage: 7.8,
    classAverage: 7.2,
    studentRank: 5,
    totalStudents: 30,
  },
];

const mockClassDetails = {
  classId: "1",
  className: "Lớp Toán 10A",
  course: { name: "Toán học" },
  grade: { name: "Lớp 10" },
  startDate: "2024-09-01",
  endDate: "2025-06-30",
  studentAverage: 8.5,
  classAverage: 7.8,
  studentRank: 3,
  totalStudents: 30,
  subjects: [
    {
      name: "Toán học",
      average: 8.5,
      assignments: [
        { name: "Bài kiểm tra 1", score: 9.0, maxScore: 10 },
        { name: "Bài kiểm tra 2", score: 8.0, maxScore: 10 },
      ],
    },
  ],
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("AcademicResultsView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", async () => {
    (getAllClassScores as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    renderWithQueryClient(<AcademicResultsView />);

    expect(screen.getByTestId("academic-results-skeleton")).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (getAllClassScores as jest.Mock).mockRejectedValue(new Error("API Error"));

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      expect(screen.getByTestId("message-card")).toBeInTheDocument();
      expect(screen.getByText("Lỗi khi tải dữ liệu.")).toBeInTheDocument();
    });
  });

  it("renders message when no data is available", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue([]);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      expect(screen.getByTestId("message-card")).toBeInTheDocument();
      expect(
        screen.getByText("Chưa có dữ liệu điểm tổng thể."),
      ).toBeInTheDocument();
    });
  });

  it("renders charts when data is loaded successfully", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      expect(screen.getByTestId("subject-score-chart")).toBeInTheDocument();
      expect(screen.getByTestId("progress-chart")).toBeInTheDocument();
      expect(screen.getByTestId("skill-chart")).toBeInTheDocument();
    });
  });

  it("renders class selector with correct options", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue("all");
    });
  });

  it("changes selected class when dropdown value changes", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);
    (getClassScoreDetail as jest.Mock).mockResolvedValue(mockClassDetails);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "1" } });
      expect(select).toHaveValue("1");
    });
  });

  it("renders header when specific class is selected", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);
    (getClassScoreDetail as jest.Mock).mockResolvedValue(mockClassDetails);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "1" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });

  it("renders tabs with correct structure", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("tab-list")).toBeInTheDocument();
      expect(screen.getByTestId("tab-charts")).toBeInTheDocument();
      expect(screen.getByTestId("tab-details")).toBeInTheDocument();
    });
  });

  it("shows charts tab content by default", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-panel-charts")).toBeInTheDocument();
      expect(screen.getByTestId("subject-score-chart")).toBeInTheDocument();
    });
  });

  it("shows detailed scores table when details tab is selected and class is selected", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);
    (getClassScoreDetail as jest.Mock).mockResolvedValue(mockClassDetails);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "1" } });
    });

    await waitFor(() => {
      const detailsTab = screen.getByTestId("tab-details");
      fireEvent.click(detailsTab);
    });

    await waitFor(() => {
      expect(screen.getByTestId("detailed-scores-table")).toBeInTheDocument();
    });
  });

  it("shows message when details tab is selected but no specific class is chosen", async () => {
    (getAllClassScores as jest.Mock).mockResolvedValue(mockAllScores);

    renderWithQueryClient(<AcademicResultsView />);

    await waitFor(() => {
      const detailsTab = screen.getByTestId("tab-details");
      fireEvent.click(detailsTab);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Vui lòng chọn một lớp học cụ thể để xem chi tiết."),
      ).toBeInTheDocument();
    });
  });
});
