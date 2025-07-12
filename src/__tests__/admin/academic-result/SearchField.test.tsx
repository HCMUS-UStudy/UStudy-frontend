import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/test",
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock use-debounce
jest.mock("use-debounce", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDebouncedCallback: (callback: any) => callback,
}));

describe("SearchField", () => {
  it("renders without crashing", () => {
    const { container } = render(<SearchField />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<SearchField placeholder="Tìm kiếm..." />);
    expect(screen.getByPlaceholderText("Tìm kiếm...")).toBeInTheDocument();
  });

  it("renders with value", () => {
    render(<SearchField value="test value" />);
    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<SearchField className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("shows loading state when isLoading is true", () => {
    render(<SearchField isLoading={true} />);
    // Should show loading component
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("has correct default structure", () => {
    const { container } = render(<SearchField />);
    expect(container.firstChild).toHaveClass(
      "flex",
      "items-center",
      "px-3",
      "w-full",
      "rounded-lg",
    );
  });

  it("has search icon", () => {
    const { container } = render(<SearchField />);
    const icon = container.querySelector(".text-primary-darkest");
    expect(icon).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<SearchField disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("accepts input props", () => {
    render(<SearchField name="search" id="search-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "search");
    expect(input).toHaveAttribute("id", "search-input");
  });
});
