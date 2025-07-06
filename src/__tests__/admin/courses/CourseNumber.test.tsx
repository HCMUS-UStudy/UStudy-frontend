import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseNumber from "@/app/ui/components/admin/courses/CourseNumber";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  keepPreviousData: {},
}));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseQuery = require("@tanstack/react-query").useQuery;

describe("CourseNumber", () => {
  it("renders loading state", () => {
    mockUseQuery.mockReturnValue({ status: "pending" });
    render(<CourseNumber searchQuery="" />);
    expect(screen.getByText(/Tổng số môn học/)).toHaveTextContent(
      "Đang tải...",
    );
  });

  it("renders total number of courses", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: { totalElements: 42 },
    });
    render(<CourseNumber searchQuery="" />);
    expect(screen.getByText(/Tổng số môn học/)).toHaveTextContent("42");
  });
});
