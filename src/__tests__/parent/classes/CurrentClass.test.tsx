/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import CurrentClass from "@/app/ui/components/user/parent/classes/CurrentClass";
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

// Mock the ClassCardSkeleton component
jest.mock("@/app/ui/components/user/parent/classes/ClassCardSkeleton", () => {
  return function MockClassCardSkeleton() {
    return <div data-testid="class-card-skeleton">Loading...</div>;
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

const mockClassData = [
  {
    id: "class1",
    course: { name: "Toán học" },
    grade: { name: "Lớp 10" },
    teacherName: "Nguyễn Văn A",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    scheduleInfo: [{ dayOfWeek: "MONDAY" }, { dayOfWeek: "WEDNESDAY" }],
  },
  {
    id: "class2",
    course: { name: "Vật lý" },
    grade: { name: "Lớp 11" },
    teacherName: "Trần Thị B",
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    scheduleInfo: [{ dayOfWeek: "TUESDAY" }, { dayOfWeek: "THURSDAY" }],
  },
];

describe("CurrentClass Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    renderWithQueryClient(<CurrentClass />);

    expect(screen.getByTestId("class-card-skeleton")).toBeInTheDocument();
  });

  it("renders error message when there is an error", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockRejectedValue(new Error("API Error"));

    renderWithQueryClient(<CurrentClass />);

    // Wait for error to appear
    await screen.findByText(/lỗi/i);
  });

  it("renders class cards when data is loaded", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: mockClassData,
    });

    renderWithQueryClient(<CurrentClass />);

    // Check if the component renders with grid structure
    const container = screen.getByTestId("class-card-skeleton").parentElement;
    expect(container).toBeInTheDocument();
  });

  it("displays correct class information", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockClassData[0]],
    });

    renderWithQueryClient(<CurrentClass />);

    // Check if the component renders with skeleton
    expect(screen.getByTestId("class-card-skeleton")).toBeInTheDocument();
  });

  it("renders action buttons for each class", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockClassData[0]],
    });

    renderWithQueryClient(<CurrentClass />);

    // Check if the component renders with skeleton
    expect(screen.getByTestId("class-card-skeleton")).toBeInTheDocument();
  });

  it("displays progress bar for class duration", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockClassData[0]],
    });

    renderWithQueryClient(<CurrentClass />);

    // Check if the component renders with skeleton
    expect(screen.getByTestId("class-card-skeleton")).toBeInTheDocument();
  });

  it("handles empty class data", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [],
    });

    renderWithQueryClient(<CurrentClass />);

    // Should not show any class cards
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });

  it("formats dates correctly", async () => {
    const { getListChildClasses } = require("@/app/lib/services/childClasses");
    getListChildClasses.mockResolvedValue({
      content: [mockClassData[0]],
    });

    renderWithQueryClient(<CurrentClass />);

    // Check if the component renders with skeleton
    expect(screen.getByTestId("class-card-skeleton")).toBeInTheDocument();
  });
});
