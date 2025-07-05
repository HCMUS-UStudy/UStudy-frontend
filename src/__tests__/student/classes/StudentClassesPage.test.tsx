import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child components
jest.mock(
  "@/app/ui/components/user/student/classes/StudentClasses",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <div data-testid="student-classes" data-search-query={props.searchQuery} />
  ),
);

jest.mock(
  "@/app/ui/components/_common/text-field/SearchField",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <input
      data-testid="search-field"
      placeholder={props.placeholder}
      className={props.className}
    />
  ),
);

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(""),
  }),
}));

const StudentClassesPage =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/user/student/classes/StudentClassesPage").default;

describe("StudentClassesPage", () => {
  it("renders the page title", () => {
    render(<StudentClassesPage />);
    expect(screen.getByText("Danh sách lớp học")).toBeInTheDocument();
  });

  it("renders the search field with correct props", () => {
    render(<StudentClassesPage />);
    const searchField = screen.getByTestId("search-field");
    expect(searchField).toBeInTheDocument();
    expect(searchField).toHaveAttribute("placeholder", "Tìm kiếm lớp học...");
    expect(searchField).toHaveClass("w-full");
  });

  it("renders the StudentClasses component with search query", () => {
    render(<StudentClassesPage />);
    const studentClasses = screen.getByTestId("student-classes");
    expect(studentClasses).toBeInTheDocument();
    expect(studentClasses).toHaveAttribute("data-search-query", "");
  });

  it("renders with correct layout structure", () => {
    render(<StudentClassesPage />);
    // Check title container
    const titleContainer = screen.getByText("Danh sách lớp học").parentElement;
    expect(titleContainer).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
    );
    // Check search container
    const searchContainers = document.querySelectorAll(
      ".flex.items-center.justify-between.mt-2.gap-14",
    );
    expect(searchContainers.length).toBeGreaterThan(0);
    // Check classes container chỉ tồn tại
    const classesContainer = screen
      .getByTestId("student-classes")
      .closest("div");
    expect(classesContainer).toBeInTheDocument();
  });

  it("renders title with correct styling", () => {
    render(<StudentClassesPage />);
    const title = screen.getByText("Danh sách lớp học");
    expect(title).toHaveClass("text-lg", "md:text-2xl", "font-bold");
  });
});
