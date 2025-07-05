import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassAdminNavigation from "@/app/ui/components/admin/classes/ClassAdminNavigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: () => ({
    classId: "test-class-123",
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock react-icons
jest.mock("react-icons/io", () => ({
  IoIosArrowDown: () => <span data-testid="arrow-down">▼</span>,
}));

describe("ClassAdminNavigation", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders all navigation tabs", () => {
    render(<ClassAdminNavigation activeTab="" />);

    expect(screen.getAllByText("Thông tin lớp học")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Thông báo")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Tài liệu")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Bài tập")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Thành viên")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Điểm danh")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Cài đặt")[0]).toBeInTheDocument();
  });

  it("highlights active tab correctly", () => {
    render(<ClassAdminNavigation activeTab="notifications" />);

    const activeTabs = screen.getAllByText("Thông báo");
    const desktopTab = activeTabs[0]; // Desktop tab
    expect(desktopTab).toHaveClass("text-primary-darkest", "font-semibold");
  });

  it("navigates to correct URL when tab is clicked", () => {
    render(<ClassAdminNavigation activeTab="" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const desktopTab = notificationsTabs[0]; // Desktop tab
    fireEvent.click(desktopTab);

    expect(mockPush).toHaveBeenCalledWith(
      "/admin/classes/test-class-123/notifications",
    );
  });

  it("navigates to overview when empty activeTab", () => {
    render(<ClassAdminNavigation activeTab="" />);

    const overviewTabs = screen.getAllByText("Thông tin lớp học");
    const desktopTab = overviewTabs[0]; // Desktop tab
    fireEvent.click(desktopTab);

    expect(mockPush).toHaveBeenCalledWith("/admin/classes/test-class-123/");
  });

  it("shows mobile dropdown on small screens", () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    // Should show the dropdown trigger
    const notificationsTabs = screen.getAllByText("Thông báo");
    expect(notificationsTabs[1]).toBeInTheDocument(); // Mobile tab
    expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
  });

  it("opens mobile dropdown when clicked", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const mobileTab = notificationsTabs[1]; // Mobile tab
    fireEvent.click(mobileTab);

    // Should show all options in dropdown
    expect(screen.getAllByText("Thông tin lớp học")[1]).toBeInTheDocument(); // Dropdown item
    expect(screen.getAllByText("Tài liệu")[1]).toBeInTheDocument(); // Dropdown item
    expect(screen.getAllByText("Bài tập")[1]).toBeInTheDocument(); // Dropdown item
  });

  it("closes mobile dropdown when clicking outside", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const mobileTab = notificationsTabs[1]; // Mobile tab
    fireEvent.click(mobileTab);

    // Verify dropdown is open
    expect(screen.getAllByText("Tài liệu")[1]).toBeInTheDocument(); // Dropdown item

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      // Check that dropdown item is no longer present (index 1 should not exist)
      expect(screen.getAllByText("Tài liệu")).toHaveLength(1); // Only desktop tab remains
    });
  });

  it("navigates correctly from mobile dropdown", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const mobileTab = notificationsTabs[1]; // Mobile tab
    fireEvent.click(mobileTab);

    const materialTabs = screen.getAllByText("Tài liệu");
    const dropdownMaterialTab = materialTabs[1]; // Dropdown item
    fireEvent.click(dropdownMaterialTab);

    expect(mockPush).toHaveBeenCalledWith(
      "/teacher/classes/test-class-123/material",
    );
  });

  it("closes dropdown after navigation on mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const mobileTab = notificationsTabs[1]; // Mobile tab
    fireEvent.click(mobileTab);

    const materialTabs = screen.getAllByText("Tài liệu");
    const dropdownMaterialTab = materialTabs[1]; // Dropdown item
    fireEvent.click(dropdownMaterialTab);

    // Dropdown should close after navigation - only desktop tab should remain
    expect(screen.getAllByText("Tài liệu")).toHaveLength(1);
  });

  it("shows default text when no active tab matches", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="invalid-tab" />);

    expect(screen.getByText("Chọn mục")).toBeInTheDocument();
  });

  it("applies correct styling to active tab in mobile dropdown", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassAdminNavigation activeTab="notifications" />);

    const notificationsTabs = screen.getAllByText("Thông báo");
    const mobileTab = notificationsTabs[1]; // Mobile tab
    fireEvent.click(mobileTab);

    const activeTabs = screen.getAllByText("Thông báo");
    const dropdownActiveTab = activeTabs[2]; // Dropdown active item
    expect(dropdownActiveTab).toHaveClass(
      "bg-primary-light",
      "font-bold",
      "text-primary-darkest",
    );
  });

  it("handles multiple rapid clicks gracefully", () => {
    render(<ClassAdminNavigation activeTab="" />);

    const notificationsTabs = screen.getAllByText("Thông báo");

    fireEvent.click(notificationsTabs[0]);
    fireEvent.click(notificationsTabs[0]);
    fireEvent.click(notificationsTabs[0]);

    expect(mockPush).toHaveBeenCalledTimes(3);
  });

  it("maintains navigation state after route changes", () => {
    const { rerender } = render(
      <ClassAdminNavigation activeTab="notifications" />,
    );

    rerender(<ClassAdminNavigation activeTab="material" />);

    const materialTabs = screen.getAllByText("Tài liệu");
    const desktopTab = materialTabs[0]; // Desktop tab
    expect(desktopTab).toHaveClass("text-primary-darkest", "font-semibold");
  });
});
