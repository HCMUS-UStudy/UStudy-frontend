/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseTable from "@/app/ui/components/admin/courses/CourseTable";

jest.mock("@/app/lib/services/course", () => ({ getAllCourses: jest.fn() }));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  keepPreviousData: {},
}));
jest.mock("@/app/ui/components/_common/text-field/SearchField", () => ({
  __esModule: true,
  default: (props: any) => <input data-testid="search-field" {...props} />,
}));
jest.mock("@/app/ui/components/_common/Table", () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ columns }: any) => (
    <thead>
      <tr>
        {columns.map((col: string) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));
jest.mock("@/app/ui/components/_common/Pagination", () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, handlePageClick }: any) => (
    <div data-testid="pagination">
      <button
        data-testid="next-page"
        onClick={() => handlePageClick(currentPage + 1)}
      >
        Next
      </button>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
    </div>
  ),
}));
jest.mock("@/app/ui/components/_common/EmptyListOrTable", () => ({
  __esModule: true,
  default: ({ message }: any) => <div data-testid="empty-list">{message}</div>,
}));
jest.mock("@/app/ui/components/_common/Tooltip", () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));
jest.mock("@/app/ui/components/admin/courses/EditCourse", () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? <div data-testid="edit-course-modal">EditCourseModal</div> : null,
}));
jest.mock("react-icons/fa", () => ({
  FaEdit: () => <span data-testid="edit-icon">Edit</span>,
  FaPaperclip: () => <span data-testid="paperclip">Clip</span>,
}));

describe("CourseTable", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseQuery = require("@tanstack/react-query").useQuery;

  it("renders loading state", () => {
    mockUseQuery.mockReturnValue({ status: "pending" });
    render(<CourseTable searchQuery="" />);
    expect(screen.getByTestId("search-field")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: { totalElements: 0 },
    });
    render(<CourseTable searchQuery="" />);
    expect(screen.getByTestId("empty-list")).toBeInTheDocument();
  });

  it("renders table with data and can open edit modal", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: {
        totalElements: 1,
        totalPages: 1,
        content: [
          {
            detailedCourseDto: {
              id: "1",
              name: "Toán",
              createdBy: { name: "Admin" },
            },
            totalGrades: 3,
          },
        ],
      },
    });
    render(<CourseTable searchQuery="" />);
    expect(screen.getByText("Toán")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("edit-icon"));
    expect(screen.getByTestId("edit-course-modal")).toBeInTheDocument();
  });

  it("renders pagination and can go to next page", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: {
        totalElements: 10,
        totalPages: 2,
        content: [
          {
            detailedCourseDto: {
              id: "1",
              name: "Toán",
              createdBy: { name: "Admin" },
            },
            totalGrades: 3,
          },
        ],
      },
    });
    render(<CourseTable searchQuery="" />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("next-page"));
    expect(screen.getByTestId("current-page")).toHaveTextContent("2");
  });
});
