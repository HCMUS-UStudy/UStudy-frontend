import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("?query=test"),
  usePathname: () => "/test-path",
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock use-debounce
jest.mock("use-debounce", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDebouncedCallback: (callback: any) => (value: any) => callback(value),
}));

// Mock Loading component
jest.mock(
  "@/app/ui/components/_common/loading/Loading",
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  () => (props: any) => (
    <div data-testid="loading" className={props.className} />
  ),
);

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: () => <div data-testid="search-icon" />,
}));

const SearchField =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/_common/text-field/SearchField").default;

describe("SearchField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input with correct placeholder", () => {
    render(<SearchField placeholder="Tìm kiếm..." />);

    const input = screen.getByPlaceholderText("Tìm kiếm...");
    expect(input).toBeInTheDocument();
  });

  it("renders search icon", () => {
    render(<SearchField />);

    const searchIcon = screen.getByTestId("search-icon");
    expect(searchIcon).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<SearchField className="custom-class" />);

    const container = screen.getByRole("textbox").closest("div");
    expect(container).toHaveClass("custom-class");
  });

  it("handles input change and calls onSearch callback", () => {
    const mockOnSearch = jest.fn();
    render(<SearchField onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test search" } });

    expect(mockOnSearch).toHaveBeenCalledWith("test search");
  });

  it("shows loading indicator when isLoading is true", () => {
    render(<SearchField isLoading={true} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("does not show loading indicator when isLoading is false", () => {
    render(<SearchField isLoading={false} />);

    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("applies correct default styling classes", () => {
    render(<SearchField />);
    const container = screen.getByRole("textbox").closest("div");
    expect(container).toHaveClass(
      "flex",
      "items-center",
      "px-3",
      "w-full",
      "rounded-lg",
      "focus-within:outline-none",
      "focus-within:ring-2",
      "focus-within:ring-control-ring",
      "focus-within:shadow-sm",
      "border",
      "border-slate-300",
      "bg-primary-lighter",
    );
  });

  it("applies correct input styling classes", () => {
    render(<SearchField />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "w-full",
      "rounded-lg",
      "px-3",
      "py-2",
      "text-xs",
      "md:text-sm",
      "text-ellipsis",
      "outline-none",
      "placeholder-gray-600",
      "bg-transparent",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
    );
  });

  it("handles disabled state", () => {
    render(<SearchField disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("handles custom queryKey as string", () => {
    const mockOnSearch = jest.fn();
    render(<SearchField queryKey="customKey" onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("handles custom queryKey as array", () => {
    const mockOnSearch = jest.fn();
    render(<SearchField queryKey={["key1", "key2"]} onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("renders with focus styles when focused", () => {
    render(<SearchField />);

    const input = screen.getByRole("textbox");
    const container = input.closest("div");

    fireEvent.focus(input);

    expect(container).toHaveClass(
      "focus-within:ring-2",
      "focus-within:ring-control-ring",
    );
  });

  it("renders with correct default props", () => {
    render(<SearchField />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toBeDisabled();
  });

  it("passes through additional input props", () => {
    render(<SearchField data-testid="custom-input" aria-label="Search" />);

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("aria-label", "Search");
  });

  it("handles empty search term", () => {
    const mockOnSearch = jest.fn();
    render(<SearchField onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
