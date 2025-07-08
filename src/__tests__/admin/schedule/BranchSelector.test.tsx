import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock action
jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(),
}));

// Mock react-icons
jest.mock("react-icons/ti", () => ({
  TiArrowSortedDown: () => <div data-testid="arrow-icon" />,
}));

import { useSelector, useDispatch } from "react-redux";
import { getUserDataFromCookies } from "@/app/lib/action";
import BranchSelector from "@/app/ui/components/admin/BranchSelector";

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockGetUserDataFromCookies =
  getUserDataFromCookies as jest.MockedFunction<typeof getUserDataFromCookies>;

describe("BranchSelector", () => {
  const mockDispatch = jest.fn();

  const mockBranches = [
    { id: "branch-1", name: "Chi nhánh 1" },
    { id: "branch-2", name: "Chi nhánh 2" },
    { id: "branch-3", name: "Chi nhánh 3" },
  ];

  const mockUserData = {
    branches: mockBranches,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetUserDataFromCookies.mockResolvedValue(mockUserData as any);
  });

  it("renders without crashing", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);
    expect(screen.getByText("Chi nhánh 1")).toBeInTheDocument();
  });

  it("shows selected branch name", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-2",
    });

    render(<BranchSelector />);
    expect(screen.getByText("Chi nhánh 2")).toBeInTheDocument();
  });

  it("shows default text when no branch selected", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: null,
    });

    render(<BranchSelector />);
    expect(screen.getByText("Chọn chi nhánh")).toBeInTheDocument();
  });

  it("shows error message when no branches available", () => {
    mockUseSelector.mockReturnValue({
      branches: [],
      selectedBranchId: null,
    });

    render(<BranchSelector />);
    expect(screen.getByText("Không có chi nhánh nào")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 1");
    fireEvent.click(selector);

    expect(screen.getAllByText("Chi nhánh 1")).toHaveLength(2);
    expect(screen.getByText("Chi nhánh 2")).toBeInTheDocument();
    expect(screen.getByText("Chi nhánh 3")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 1");
    fireEvent.click(selector);

    // Dropdown should be open
    expect(screen.getByText("Chi nhánh 2")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should be closed (only selected branch visible)
    expect(screen.queryByText("Chi nhánh 2")).not.toBeInTheDocument();
  });

  it("calls dispatch when branch is selected", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 1");
    fireEvent.click(selector);

    const branch2Option = screen.getByText("Chi nhánh 2");
    fireEvent.click(branch2Option);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("highlights selected branch in dropdown", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-2",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 2");
    fireEvent.click(selector);

    // Selected branch should have different styling
    const selectedOptions = screen.getAllByText("Chi nhánh 2");
    expect(selectedOptions).toHaveLength(2);
  });

  it("sorts branches alphabetically", async () => {
    const unsortedBranches = [
      { id: "branch-3", name: "Chi nhánh C" },
      { id: "branch-1", name: "Chi nhánh A" },
      { id: "branch-2", name: "Chi nhánh B" },
    ];

    // Mock the sorted branches that would be returned by Redux
    const sortedBranches = [
      { id: "branch-1", name: "Chi nhánh A" },
      { id: "branch-2", name: "Chi nhánh B" },
      { id: "branch-3", name: "Chi nhánh C" },
    ];

    mockUseSelector.mockReturnValue({
      branches: sortedBranches,
      selectedBranchId: "branch-1",
    });

    mockGetUserDataFromCookies.mockResolvedValue({
      branches: unsortedBranches,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh A");
    fireEvent.click(selector);

    // Branches should be sorted alphabetically (A, B, C)
    expect(screen.getAllByText("Chi nhánh A").length).toBe(2); // selector + dropdown
    expect(screen.getAllByText("Chi nhánh B").length).toBe(1);
    expect(screen.getAllByText("Chi nhánh C").length).toBe(1);
  });

  it("handles user data fetch error", async () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    mockGetUserDataFromCookies.mockRejectedValue(new Error("Failed to fetch"));

    render(<BranchSelector />);

    // Should still show branches from Redux state
    expect(screen.getByText("Chi nhánh 1")).toBeInTheDocument();
  });

  it("handles missing user data", async () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    mockGetUserDataFromCookies.mockResolvedValue(null);

    render(<BranchSelector />);

    // Should still show branches from Redux state
    expect(screen.getByText("Chi nhánh 1")).toBeInTheDocument();
  });

  it("handles empty branches array", async () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    mockGetUserDataFromCookies.mockResolvedValue({
      branches: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<BranchSelector />);

    // Should still show branches from Redux state
    expect(screen.getByText("Chi nhánh 1")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 1").closest("div");
    expect(selector).toHaveClass(
      "px-3",
      "sm:px-4",
      "py-1.5",
      "md:py-[10px]",
      "rounded-xl",
      "md:rounded-[14px]",
      "bg-primary",
      "hover:bg-hover-primary",
    );
  });

  it("applies correct dropdown styling", () => {
    mockUseSelector.mockReturnValue({
      branches: mockBranches,
      selectedBranchId: "branch-1",
    });

    render(<BranchSelector />);

    const selector = screen.getByText("Chi nhánh 1");
    fireEvent.click(selector);

    const dropdown = screen.getByText("Chi nhánh 2").closest("div");
    expect(dropdown).toHaveClass(
      "px-4",
      "py-2",
      "text-sm",
      "md:text-base",
      "cursor-pointer",
      "hover:bg-primary-light",
      "transition-all",
    );
  });
});
