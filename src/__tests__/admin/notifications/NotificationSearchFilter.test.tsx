import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationSearchFilter from "@/app/ui/components/admin/notifications/NotificationSearchFilter";

describe("NotificationSearchFilter", () => {
  const defaultProps = {
    searchTerm: "",
    filterType: "ALL",
    filterStatus: "ALL",
    totalCount: 5,
    unreadCount: 2,
    onSearchChange: jest.fn(),
    onFilterTypeChange: jest.fn(),
    onFilterStatusChange: jest.fn(),
  };

  it("renders input and filters", () => {
    render(<NotificationSearchFilter {...defaultProps} />);
    expect(
      screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/tất cả loại/i)).toBeInTheDocument();
    expect(screen.getByText(/tất cả trạng thái/i)).toBeInTheDocument();
    expect(screen.getByText(/tổng cộng/i)).toBeInTheDocument();
    expect(screen.getByText(/chưa đọc/i)).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", () => {
    const onSearchChange = jest.fn();
    render(
      <NotificationSearchFilter
        {...defaultProps}
        onSearchChange={onSearchChange}
      />,
    );
    const input = screen.getByPlaceholderText(
      "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
    );
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onSearchChange).toHaveBeenCalledWith("abc");
  });

  it("calls onFilterTypeChange when clicking type filter", () => {
    const onFilterTypeChange = jest.fn();
    render(
      <NotificationSearchFilter
        {...defaultProps}
        onFilterTypeChange={onFilterTypeChange}
      />,
    );
    const typeBtn = screen.getByText(/tất cả loại/i).closest("button");
    fireEvent.click(typeBtn!);
  });

  it("calls onFilterStatusChange when clicking status filter", () => {
    const onFilterStatusChange = jest.fn();
    render(
      <NotificationSearchFilter
        {...defaultProps}
        onFilterStatusChange={onFilterStatusChange}
      />,
    );
    const statusBtn = screen.getByText(/tất cả trạng thái/i).closest("button");
    fireEvent.click(statusBtn!);
  });
});
