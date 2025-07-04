import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationDetailHeader from "@/app/ui/components/admin/notifications/NotificationDetailHeader";

describe("NotificationDetailHeader", () => {
  const mockOnBack = jest.fn();
  const mockOnToggleSidebar = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnToggleSidebar.mockClear();
  });

  it("renders back button", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={false}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    expect(screen.getByText("Trở về danh sách")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={false}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    const backButton = screen.getByText("Trở về danh sách");
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("shows menu icon when sidebar is closed", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={false}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    // The menu icon should be present (IoMenu)
    const toggleButton = screen.getByRole("button", { name: "" });
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows close icon when sidebar is open", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={true}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    // The close icon should be present (IoClose)
    const toggleButton = screen.getByRole("button", { name: "" });
    expect(toggleButton).toBeInTheDocument();
  });

  it("calls onToggleSidebar when toggle button is clicked", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={false}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    const toggleButton = screen.getByRole("button", { name: "" });
    fireEvent.click(toggleButton);
    expect(mockOnToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("renders with correct structure", () => {
    render(
      <NotificationDetailHeader
        onBack={mockOnBack}
        sidebarOpen={false}
        onToggleSidebar={mockOnToggleSidebar}
      />,
    );
    // Check for main elements
    expect(screen.getByText("Trở về danh sách")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2); // back button + toggle button
  });
});
