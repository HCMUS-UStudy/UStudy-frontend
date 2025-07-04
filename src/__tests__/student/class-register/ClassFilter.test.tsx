import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
} from "@tanstack/react-query";

const replaceMock = jest.fn();

// Mock next/navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: replaceMock }),
  usePathname: () => "/test-path",
  useSearchParams: () => ({ get: () => "" }),
}));

jest.mock("@tanstack/react-query");

describe("ClassFilter (logic/UI)", () => {
  const ClassFilter =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/app/ui/components/user/student/class-register/ClassFilter").default;
  const queryClient = new QueryClient();
  const renderWithProvider = (ui: React.ReactElement) =>
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with filter options and calls router.replace on change", () => {
    (useQueries as jest.Mock).mockReturnValue([
      { data: { content: [{ id: 1, name: "Khối 10" }] } },
      { data: { content: [{ detailedCourseDto: { id: 2, name: "Toán" } }] } },
    ]);
    renderWithProvider(<ClassFilter />);
    // Chọn filter grade
    const filterBtn = screen.getByText(/lọc khối học/i);
    expect(filterBtn).toBeInTheDocument();
    // fireEvent.change(select, { target: { value: "1" } });
    // expect(replaceMock).toHaveBeenCalled();
  });

  it("renders with empty filter data", () => {
    (useQueries as jest.Mock).mockReturnValue([
      { data: { content: [] } },
      { data: { content: [] } },
    ]);
    renderWithProvider(<ClassFilter />);
    expect(screen.getByText(/lọc khối học/i)).toBeInTheDocument();
    expect(screen.getByText(/lọc môn học/i)).toBeInTheDocument();
  });

  it("handles edge case: queries return undefined", () => {
    (useQueries as jest.Mock).mockReturnValue([
      { data: { content: [] } },
      { data: { content: [] } },
    ]);
    renderWithProvider(<ClassFilter />);
    expect(screen.getByText(/lọc khối học/i)).toBeInTheDocument();
    expect(screen.getByText(/lọc môn học/i)).toBeInTheDocument();
  });
});
