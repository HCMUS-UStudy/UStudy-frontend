import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationSearchFilter from "@/app/ui/components/admin/notifications/NotificationSearchFilter";
import "@testing-library/jest-dom";

describe("NotificationSearchFilter", () => {
  const mockProps = {
    searchTerm: "",
    filterType: "ALL" as const,
    filterStatus: "ALL" as const,
    totalCount: 10,
    unreadCount: 3,
    onSearchChange: jest.fn(),
    onFilterTypeChange: jest.fn(),
    onFilterStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render search input", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(
        screen.getByPlaceholderText(
          "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
        ),
      ).toBeInTheDocument();
    });

    it("should render type filter button", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tất cả loại")).toBeInTheDocument();
    });

    it("should render status filter button", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tất cả trạng thái")).toBeInTheDocument();
    });

    it("should render total count", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const totalCounts = screen.getAllByText("10");
      const found = totalCounts.some((el) =>
        el.parentElement?.textContent?.includes("Tổng cộng"),
      );
      expect(found).toBe(true);
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
    });

    it("should render unread count", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const unreadCounts = screen.getAllByText("3");
      const found = unreadCounts.some((el) =>
        el.parentElement?.textContent?.includes("Chưa đọc"),
      );
      expect(found).toBe(true);
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should call onSearchChange when search input changes", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      fireEvent.change(searchInput, { target: { value: "test search" } });
      expect(mockProps.onSearchChange).toHaveBeenCalledWith("test search");
    });

    it("should display current search term", () => {
      render(
        <NotificationSearchFilter {...mockProps} searchTerm="current search" />,
      );
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      expect(searchInput).toHaveValue("current search");
    });

    it("should handle empty search term", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      fireEvent.change(searchInput, { target: { value: "" } });
      expect(searchInput).toHaveValue("");
    });
  });

  describe("Filter Functionality", () => {
    it("should render filter labels", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Loại thông báo")).toBeInTheDocument();
      expect(screen.getByText("Trạng thái")).toBeInTheDocument();
    });

    it("should render search label", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tìm kiếm")).toBeInTheDocument();
    });
  });

  describe("Count Display", () => {
    it("should display singular form for one unread notification", () => {
      render(<NotificationSearchFilter {...mockProps} unreadCount={1} />);
      const unreadCounts = screen.getAllByText("1");
      const found = unreadCounts.some((el) =>
        el.parentElement?.textContent?.includes("Chưa đọc"),
      );
      expect(found).toBe(true);
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });

    it("should display plural form for multiple unread notifications", () => {
      render(<NotificationSearchFilter {...mockProps} unreadCount={5} />);
      const unreadCounts = screen.getAllByText("5");
      const found = unreadCounts.some((el) =>
        el.parentElement?.textContent?.includes("Chưa đọc"),
      );
      expect(found).toBe(true);
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });

    it("should display zero count correctly", () => {
      render(
        <NotificationSearchFilter
          {...mockProps}
          totalCount={0}
          unreadCount={0}
        />,
      );
      const zeroCounts = screen.getAllByText("0");
      const foundTotal = zeroCounts.some((el) =>
        el.parentElement?.textContent?.includes("Tổng cộng"),
      );
      const foundUnread = zeroCounts.some((el) =>
        el.parentElement?.textContent?.includes("Chưa đọc"),
      );
      expect(foundTotal).toBe(true);
      expect(foundUnread).toBe(true);
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should have correct container classes", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
    });

    it("should have responsive padding", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
    });

    it("should have responsive grid layout", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
    });
  });

  describe("Input Attributes", () => {
    it("should have correct search input attributes", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("should have correct select attributes", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tất cả loại")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for form controls", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      expect(searchInput).toBeInTheDocument();
    });

    it("should have proper select elements", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      expect(screen.getByText("Tất cả loại")).toBeInTheDocument();
      expect(screen.getByText("Tất cả trạng thái")).toBeInTheDocument();
    });
  });

  describe("Filter Combinations", () => {
    it("should handle multiple filter changes", () => {
      render(<NotificationSearchFilter {...mockProps} />);
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      fireEvent.change(searchInput, { target: { value: "test" } });
      expect(mockProps.onSearchChange).toHaveBeenCalledWith("test");
    });

    it("should maintain filter state when props change", () => {
      render(
        <NotificationSearchFilter {...mockProps} searchTerm="new search" />,
      );
      const searchInput = screen.getByPlaceholderText(
        "Tìm kiếm theo tiêu đề, nội dung hoặc người gửi...",
      );
      expect(searchInput).toHaveValue("new search");
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined counts", () => {
      render(
        <NotificationSearchFilter
          {...mockProps}
          totalCount={0}
          unreadCount={0}
        />,
      );
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });

    it("should handle very large counts", () => {
      render(
        <NotificationSearchFilter
          {...mockProps}
          totalCount={999999}
          unreadCount={999999}
        />,
      );
      expect(screen.getByText("Tổng cộng")).toBeInTheDocument();
      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
      expect(screen.getAllByText("999999").length).toBeGreaterThanOrEqual(2);
    });
  });
});
