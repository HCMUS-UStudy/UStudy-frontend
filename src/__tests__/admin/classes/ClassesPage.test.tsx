import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassesPage from "@/app/(admin)/admin/classes/page";

// Mock the components
jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  return function MockSearchField({ placeholder }: { placeholder: string }) {
    return <input data-testid="search-field" placeholder={placeholder} />;
  };
});

jest.mock("@/app/ui/components/admin/classes/create/CreateClassButton", () => {
  return function MockCreateClassButton() {
    return <button data-testid="create-class-button">Tạo lớp mới</button>;
  };
});

jest.mock("@/app/ui/components/admin/classes/ClassesTable", () => {
  return function MockClassesTable({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    return (
      <div data-testid="classes-table">
        <span data-testid="query-display">{query}</span>
        <span data-testid="page-display">{currentPage}</span>
      </div>
    );
  };
});

describe("Classes Page", () => {
  it("renders with default search parameters", async () => {
    const mockSearchParams = Promise.resolve({
      query: undefined,
      page: undefined,
    });

    render(await ClassesPage({ searchParams: mockSearchParams }));

    expect(screen.getByTestId("search-field")).toBeInTheDocument();
    expect(screen.getByTestId("create-class-button")).toBeInTheDocument();
    expect(screen.getByTestId("classes-table")).toBeInTheDocument();
    expect(screen.getByTestId("query-display")).toHaveTextContent("");
    expect(screen.getByTestId("page-display")).toHaveTextContent("1");
  });

  it("renders with provided search parameters", async () => {
    const mockSearchParams = Promise.resolve({
      query: "test class",
      page: "2",
    });

    render(await ClassesPage({ searchParams: mockSearchParams }));

    expect(screen.getByTestId("query-display")).toHaveTextContent("test class");
    expect(screen.getByTestId("page-display")).toHaveTextContent("2");
  });

  it("renders search field with correct placeholder", async () => {
    const mockSearchParams = Promise.resolve({
      query: undefined,
      page: undefined,
    });

    render(await ClassesPage({ searchParams: mockSearchParams }));

    const searchField = screen.getByTestId("search-field");
    expect(searchField).toHaveAttribute("placeholder", "Tìm theo tên lớp...");
  });

  it("handles empty searchParams gracefully", async () => {
    const mockSearchParams = Promise.resolve({});

    render(await ClassesPage({ searchParams: mockSearchParams }));

    expect(screen.getByTestId("query-display")).toHaveTextContent("");
    expect(screen.getByTestId("page-display")).toHaveTextContent("1");
  });

  it("handles invalid page number gracefully", async () => {
    const mockSearchParams = Promise.resolve({
      query: "test",
      page: "invalid",
    });

    render(await ClassesPage({ searchParams: mockSearchParams }));

    expect(screen.getByTestId("page-display")).toHaveTextContent("1");
  });
});
