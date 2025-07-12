import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageScoresTable from "@/app/ui/components/admin/manage-scores/ManageScoresTable";

// Mock the services
jest.mock("@/app/lib/services/academicResult", () => ({
  getAcademicResult: jest.fn(),
}));

// Mock the components
jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    onPageChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) {
    return (
      <div data-testid="pagination">
        <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

describe("ManageScoresTable", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGetAcademicResult: jest.MockedFunction<any>;

  beforeEach(() => {
    mockGetAcademicResult =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/academicResult").getAcademicResult;
    mockGetAcademicResult.mockResolvedValue({
      assignmentScores: {
        content: [],
        totalPages: 0,
        totalElements: 0,
      },
      averageScore: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    classId: "class1",
    search: "",
    sortBy: "title",
    sortOrder: "asc" as const,
    currentPage: 1,
    onSort: jest.fn(),
    setCurrentPage: jest.fn(),
  };

  it("renders without crashing", () => {
    const { container } = render(<ManageScoresTable {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("shows loading component", () => {
    render(<ManageScoresTable {...defaultProps} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("accepts correct props", () => {
    const { container } = render(<ManageScoresTable {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("calls API with correct parameters", () => {
    render(<ManageScoresTable {...defaultProps} />);
    expect(mockGetAcademicResult).toHaveBeenCalledWith("class1", 1, 10);
  });

  it("handles different classId", () => {
    render(<ManageScoresTable {...defaultProps} classId="class2" />);
    expect(mockGetAcademicResult).toHaveBeenCalledWith("class2", 1, 10);
  });

  it("handles different currentPage", () => {
    render(<ManageScoresTable {...defaultProps} currentPage={2} />);
    expect(mockGetAcademicResult).toHaveBeenCalledWith("class1", 2, 10);
  });
});
