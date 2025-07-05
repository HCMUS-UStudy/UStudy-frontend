import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationNotFound from "@/app/ui/components/admin/notifications/NotificationNotFound";

describe("NotificationNotFound", () => {
  const mockOnBackToList = jest.fn();

  beforeEach(() => {
    mockOnBackToList.mockClear();
  });

  it("renders not found message", () => {
    render(<NotificationNotFound onBackToList={mockOnBackToList} />);
    expect(screen.getByText("Không tìm thấy thông báo")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Thông báo này có thể đã bị xóa hoặc không tồn tại trong hệ thống.",
      ),
    ).toBeInTheDocument();
  });

  it("calls onBackToList when back button is clicked", () => {
    render(<NotificationNotFound onBackToList={mockOnBackToList} />);
    const backButton = screen.getByText("Quay lại danh sách");
    fireEvent.click(backButton);
    expect(mockOnBackToList).toHaveBeenCalledTimes(1);
  });

  it("renders back button with correct text", () => {
    render(<NotificationNotFound onBackToList={mockOnBackToList} />);
    expect(screen.getByText("Quay lại danh sách")).toBeInTheDocument();
  });

  it("renders with correct structure", () => {
    render(<NotificationNotFound onBackToList={mockOnBackToList} />);
    // Check for main elements
    expect(screen.getByText("Không tìm thấy thông báo")).toBeInTheDocument();
    expect(screen.getByText("Quay lại danh sách")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
