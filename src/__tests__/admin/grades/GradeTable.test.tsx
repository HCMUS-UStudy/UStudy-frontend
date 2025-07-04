/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GradeTable from "@/app/ui/components/admin/grades/GradeTable";

jest.mock("@/app/lib/services/grade", () => ({ getAllGrades: jest.fn() }));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  keepPreviousData: {},
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
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
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
jest.mock("@/app/ui/components/_common/Tooltip", () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));
jest.mock("@/app/ui/components/admin/grades/EditGrade", () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? <div data-testid="edit-grade-modal">EditGradeModal</div> : null,
}));
jest.mock("react-icons/fa", () => ({
  FaEdit: () => <span data-testid="edit-icon">Edit</span>,
}));

describe("GradeTable", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseQuery = require("@tanstack/react-query").useQuery;

  it("renders loading state", () => {
    mockUseQuery.mockReturnValue({ status: "pending" });
    render(<GradeTable searchQuery="" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders table with data and can open edit modal", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: {
        totalPages: 1,
        content: [
          { id: "1", name: "Khối 10" },
          { id: "2", name: "Khối 11" },
        ],
      },
    });
    render(<GradeTable searchQuery="" />);
    expect(screen.getByText("Khối 10")).toBeInTheDocument();
    expect(screen.getByText("Khối 11")).toBeInTheDocument();
    expect(screen.getAllByTestId("edit-icon")).toHaveLength(2);
    fireEvent.click(screen.getAllByTestId("edit-icon")[0]);
    expect(screen.getByTestId("edit-grade-modal")).toBeInTheDocument();
  });

  it("renders pagination and can go to next page", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: {
        totalPages: 2,
        content: [{ id: "1", name: "Khối 10" }],
      },
    });
    render(<GradeTable searchQuery="" />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("next-page"));
    expect(screen.getByTestId("current-page")).toHaveTextContent("2");
  });
});
