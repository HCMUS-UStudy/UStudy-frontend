/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child components
jest.mock(
  "@/app/ui/components/user/student/classes/ClassList",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <div data-testid="class-list" data-status={props.status}>
      {props.classes?.content?.map((classItem: any) => (
        <div key={classItem.id} data-testid={`class-item-${classItem.id}`}>
          {classItem.name}
        </div>
      ))}
    </div>
  ),
);

jest.mock(
  "@/app/ui/components/_common/Pagination",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <div data-testid="pagination">
      <button
        data-testid="prev-page"
        onClick={props.handlePreviousPage}
        disabled={props.currentPage === 1}
      >
        Previous
      </button>
      <span data-testid="current-page">{props.currentPage}</span>
      <span data-testid="total-pages">{props.totalPages}</span>
      <button
        data-testid="next-page"
        onClick={props.handleNextPage}
        disabled={props.currentPage === props.totalPages}
      >
        Next
      </button>
      <button data-testid="page-2" onClick={() => props.handlePageClick(2)}>
        2
      </button>
    </div>
  ),
);

// Mock services
jest.mock("@/app/lib/services/class", () => ({
  getAllStudentClasses: jest.fn(),
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  keepPreviousData: "keepPreviousData",
}));

const StudentClasses =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/user/student/classes/StudentClasses").default;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseQuery = require("@tanstack/react-query").useQuery;

describe("StudentClasses", () => {
  const mockClasses = {
    content: [
      {
        id: "1",
        name: "Lớp Toán 10A",
        description: "Lớp học toán cơ bản",
        course: { id: "1", name: "Toán" },
        grade: { id: "1", name: "Lớp 10" },
      },
      {
        id: "2",
        name: "Lớp Văn 10B",
        description: "Lớp học văn học",
        course: { id: "2", name: "Văn" },
        grade: { id: "1", name: "Lớp 10" },
      },
    ],
    totalElements: 2,
    totalPages: 1,
    pageNumber: 0,
    pageSize: 5,
    last: true,
  };

  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: mockClasses,
      status: "success",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders ClassList with correct props", () => {
    render(<StudentClasses searchQuery="" />);

    const classList = screen.getByTestId("class-list");
    expect(classList).toBeInTheDocument();
    expect(classList).toHaveAttribute("data-status", "success");
  });

  it("renders pagination when classes exist", () => {
    render(<StudentClasses searchQuery="" />);

    const pagination = screen.getByTestId("pagination");
    expect(pagination).toBeInTheDocument();
  });

  it("does not render pagination when no classes", () => {
    mockUseQuery.mockReturnValue({
      data: { ...mockClasses, totalElements: 0 },
      status: "success",
    });

    render(<StudentClasses searchQuery="" />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("handles pagination navigation correctly", () => {
    mockUseQuery.mockReturnValue({
      data: { ...mockClasses, totalPages: 3 },
      status: "success",
    });

    render(<StudentClasses searchQuery="" />);

    // Test next page
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    // Test previous page
    const prevButton = screen.getByTestId("prev-page");
    fireEvent.click(prevButton);

    // Test specific page click
    const page2Button = screen.getByTestId("page-2");
    fireEvent.click(page2Button);
  });

  it("calls useQuery with correct parameters", () => {
    render(<StudentClasses searchQuery="math" />);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["Classes", 0, "math"],
      queryFn: expect.any(Function),
      placeholderData: "keepPreviousData",
    });
  });

  it("displays current page and total pages correctly", () => {
    mockUseQuery.mockReturnValue({
      data: { ...mockClasses, totalPages: 3 },
      status: "success",
    });

    render(<StudentClasses searchQuery="" />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
  });

  it("handles loading state", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      status: "pending",
    });

    render(<StudentClasses searchQuery="" />);

    const classList = screen.getByTestId("class-list");
    expect(classList).toHaveAttribute("data-status", "pending");
  });

  it("handles error state", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      status: "error",
    });

    render(<StudentClasses searchQuery="" />);

    const classList = screen.getByTestId("class-list");
    expect(classList).toHaveAttribute("data-status", "error");
  });

  it("renders class items when data is available", () => {
    render(<StudentClasses searchQuery="" />);

    expect(screen.getByTestId("class-item-1")).toHaveTextContent(
      "Lớp Toán 10A",
    );
    expect(screen.getByTestId("class-item-2")).toHaveTextContent("Lớp Văn 10B");
  });
});
