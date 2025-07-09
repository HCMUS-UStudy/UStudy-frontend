import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "@/app/ui/components/user/student/academic-results/Header";
import { ClassScoreDetail } from "@/app/types/class";

// Mock react-icons
jest.mock("react-icons/bs", () => ({
  BsGraphUp: () => <div data-testid="graph-icon">Graph Icon</div>,
  BsTrophy: () => <div data-testid="trophy-icon">Trophy Icon</div>,
  BsBook: () => <div data-testid="book-icon">Book Icon</div>,
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
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
}));

const mockDetails: ClassScoreDetail = {
  classId: "1",
  className: "Lớp Toán 10A",
  course: { id: "1", name: "Toán học" },
  grade: { id: "1", name: "Lớp 10" },
  startDate: "2024-09-01",
  description: "Lớp Toán nâng cao",
  studentAverage: 8.5,
  classAverage: 7.8,
  studentRank: 3,
  totalStudents: 30,
};

describe("Header", () => {
  it("renders all three cards with correct structure", () => {
    render(<Header details={mockDetails} />);

    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(3);
  });

  it("renders average score card with correct data", () => {
    render(<Header details={mockDetails} />);

    expect(screen.getByText("Điểm trung bình")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("TB lớp: 7.8")).toBeInTheDocument();
    expect(screen.getByTestId("graph-icon")).toBeInTheDocument();
  });

  it("renders ranking card with correct data", () => {
    render(<Header details={mockDetails} />);

    expect(screen.getByText("Xếp hạng")).toBeInTheDocument();
    expect(screen.getByText("3/30")).toBeInTheDocument();
    expect(screen.getByText("Trong lớp")).toBeInTheDocument();
    expect(screen.getByTestId("trophy-icon")).toBeInTheDocument();
  });

  it("renders subject card with correct data", () => {
    render(<Header details={mockDetails} />);

    expect(screen.getByText("Môn học")).toBeInTheDocument();
    expect(screen.getByText("Toán học")).toBeInTheDocument();
    expect(screen.getByText("Lớp 10")).toBeInTheDocument();
    expect(screen.getByTestId("book-icon")).toBeInTheDocument();
  });

  it("displays correct CSS classes", () => {
    const { container } = render(<Header details={mockDetails} />);

    // Check if the main grid container has correct classes
    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "md:grid-cols-3",
      "gap-4",
    );
  });

  it("renders cards with correct styling classes", () => {
    render(<Header details={mockDetails} />);

    const cards = screen.getAllByTestId("card");
    cards.forEach((card) => {
      expect(card).toHaveClass(
        "border-primary-light",
        "hover:shadow-lg",
        "transition-shadow",
      );
    });
  });

  it("renders card headers with correct styling", () => {
    render(<Header details={mockDetails} />);

    const cardHeaders = screen.getAllByTestId("card-header");
    cardHeaders.forEach((header) => {
      expect(header).toHaveClass(
        "flex",
        "flex-row",
        "items-center",
        "justify-between",
        "pb-2",
      );
    });
  });

  it("renders card titles with correct styling", () => {
    render(<Header details={mockDetails} />);

    const cardTitles = screen.getAllByTestId("card-title");
    cardTitles.forEach((title) => {
      expect(title).toHaveClass("text-lg", "font-medium", "text-gray-700");
    });
  });

  it("displays average score with correct formatting", () => {
    const detailsWithDecimal = {
      ...mockDetails,
      studentAverage: 8.75,
      classAverage: 7.25,
    };

    render(<Header details={detailsWithDecimal} />);

    expect(screen.getByText("8.8")).toBeInTheDocument(); // Rounded to 1 decimal
    expect(screen.getByText("TB lớp: 7.3")).toBeInTheDocument(); // Rounded to 1 decimal
  });

  it("handles zero values correctly", () => {
    const detailsWithZeros = {
      ...mockDetails,
      studentAverage: 0,
      classAverage: 0,
      studentRank: 0,
      totalStudents: 0,
    };

    render(<Header details={detailsWithZeros} />);

    expect(screen.getByText("0.0")).toBeInTheDocument();
    expect(screen.getByText("TB lớp: 0.0")).toBeInTheDocument();
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("renders without crashing with minimal data", () => {
    const minimalDetails = {
      classId: "1",
      className: "Test Class",
      course: { id: "1", name: "Test Course" },
      grade: { id: "1", name: "Test Grade" },
      startDate: "2024-01-01",
      description: "Test description",
      studentAverage: 5.0,
      classAverage: 5.0,
      studentRank: 1,
      totalStudents: 1,
    };
    expect(() => render(<Header details={minimalDetails} />)).not.toThrow();
  });
});
