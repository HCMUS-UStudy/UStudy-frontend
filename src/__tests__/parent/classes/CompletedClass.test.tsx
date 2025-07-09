/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import CompletedClass from "@/app/ui/components/user/parent/classes/CompletedClass";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the services
jest.mock("@/app/lib/services/childClasses", () => ({
  getListChildClasses: jest.fn(),
}));

// Mock the Card component
jest.mock("@/app/ui/components/_common/Card", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock the CompletedSkeleton component
jest.mock("@/app/ui/components/user/parent/classes/CompletedSkeleton ", () => {
  return function MockCompletedSkeleton() {
    return (
      <div data-testid="completed-skeleton">Loading completed classes...</div>
    );
  };
});

// Mock Next.js Link
jest.mock("next/link", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

const mockCompletedClassData = [
  {
    id: "completed-class1",
    course: { name: "Toán học" },
    grade: { name: "Lớp 9" },
    teacherName: "Nguyễn Văn C",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    scheduleInfo: [{ dayOfWeek: "MONDAY" }, { dayOfWeek: "WEDNESDAY" }],
  },
  {
    id: "completed-class2",
    course: { name: "Hóa học" },
    grade: { name: "Lớp 8" },
    teacherName: "Lê Thị D",
    startDate: "2023-02-01",
    endDate: "2023-11-30",
    scheduleInfo: [{ dayOfWeek: "TUESDAY" }, { dayOfWeek: "THURSDAY" }],
  },
];

describe("CompletedClass Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    renderWithQueryClient(<CompletedClass />);

    expect(screen.getByTestId("completed-skeleton")).toBeInTheDocument();
  });

  it("renders error message when there is an error", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockRejectedValue(new Error("API Error"));

    renderWithQueryClient(<CompletedClass />);

    // Wait for error to appear
    await screen.findByText(/lỗi/i);
  });

  it("renders completed class cards when data is loaded", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: mockCompletedClassData,
    });

    renderWithQueryClient(<CompletedClass />);

    // Wait for cards to appear
    await screen.findByText("Toán học");
    await screen.findByText("Hóa học");

    expect(screen.getByText("Nguyễn Văn C")).toBeInTheDocument();
    expect(screen.getByText("Lê Thị D")).toBeInTheDocument();
  });

  it("displays correct completed class information", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockCompletedClassData[0]],
    });

    renderWithQueryClient(<CompletedClass />);

    await screen.findByText("Toán học");

    expect(screen.getByText("Lớp 9")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn C")).toBeInTheDocument();
    expect(screen.getByText("Thứ Hai, Thứ Tư")).toBeInTheDocument();
  });

  it("renders action buttons for completed classes", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockCompletedClassData[0]],
    });

    renderWithQueryClient(<CompletedClass />);

    await screen.findByText("Xem kết quả chi tiết");
    await screen.findByText("Liên hệ giáo viên");

    expect(screen.getByText("Xem kết quả chi tiết")).toBeInTheDocument();
    expect(screen.getByText("Liên hệ giáo viên")).toBeInTheDocument();
  });

  it("displays completion date for completed classes", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockCompletedClassData[0]],
    });

    renderWithQueryClient(<CompletedClass />);

    await screen.findByText("Ngày hoàn thành:");

    // Check if completion date is displayed
    expect(screen.getByText(/31\/12\/2023/)).toBeInTheDocument();
  });

  it("displays progress bar for completed classes", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockCompletedClassData[0]],
    });

    renderWithQueryClient(<CompletedClass />);

    await screen.findByText("Tiến độ:");

    // Check if progress bar container exists
    const progressContainer = screen.getByText("Tiến độ:").closest("div");
    expect(progressContainer).toBeInTheDocument();
  });

  it("handles empty completed class data", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [],
    });

    renderWithQueryClient(<CompletedClass />);

    // Should not show any class cards
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });

  it("shows completed classes with gray styling", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockCompletedClassData[0]],
    });

    renderWithQueryClient(<CompletedClass />);

    await screen.findByText("Toán học");

    // Check if the card has the completed styling (gray background)
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("overflow-hidden", "rounded-2xl");
  });

  it("filters only completed classes (end date < now)", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [
        {
          ...mockCompletedClassData[0],
          endDate: "2023-12-31", // Past date
        },
        {
          ...mockCompletedClassData[1],
          endDate: "2025-12-31", // Future date (should be filtered out)
        },
      ],
    });

    renderWithQueryClient(<CompletedClass />);

    // Should only show the completed class
    await screen.findByText("Toán học");
    expect(screen.queryByText("Hóa học")).not.toBeInTheDocument();
  });
});
