import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropdownLocal from "@/app/ui/components/admin/manage-scores/DropdownLocal";

const mockItems = [
  { key: "", label: "Chọn lớp" },
  { key: "class1", label: "Lớp 10A1", description: "Lớp chuyên Toán" },
  { key: "class2", label: "Lớp 11B2", description: "Lớp ban Tự nhiên" },
];

describe("DropdownLocal", () => {
  const defaultProps = {
    label: "Chọn lớp học",
    items: mockItems,
    selected: "",
    position: "bottom-left" as const,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<DropdownLocal {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders dropdown button", () => {
    render(<DropdownLocal {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<DropdownLocal {...defaultProps} selected="" />);
    expect(screen.getByText("Chọn lớp")).toBeInTheDocument();
  });

  it("shows selected item text", () => {
    render(<DropdownLocal {...defaultProps} selected="class1" />);
    expect(screen.getByText("Lớp 10A1")).toBeInTheDocument();
  });

  it("has correct props structure", () => {
    const { container } = render(<DropdownLocal {...defaultProps} />);
    expect(container.firstChild).toHaveClass("relative");
  });
});
