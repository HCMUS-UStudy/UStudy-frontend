import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationEmptyState from "@/app/ui/components/admin/notifications/NotificationEmptyState";
import "@testing-library/jest-dom";

describe("NotificationEmptyState", () => {
  const defaultProps = {
    searchTerm: "",
    filterType: "ALL" as const,
    filterStatus: "ALL" as const,
    onRefresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render default empty state", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.",
        ),
      ).toBeInTheDocument();
    });

    it("should render search empty state", () => {
      render(<NotificationEmptyState {...defaultProps} searchTerm="test" />);
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Filter States", () => {
    it("should show type filter message", () => {
      render(<NotificationEmptyState {...defaultProps} filterType="SYSTEM" />);
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
    });

    it("should show status filter message", () => {
      render(
        <NotificationEmptyState {...defaultProps} filterStatus="UNREAD" />,
      );
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
    });
  });

  describe("Combined Filter States", () => {
    it("should show search and type filter message", () => {
      render(
        <NotificationEmptyState
          {...defaultProps}
          searchTerm="test"
          filterType="SYSTEM"
        />,
      );
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác",
        ),
      ).toBeInTheDocument();
    });

    it("should show search and status filter message", () => {
      render(
        <NotificationEmptyState
          {...defaultProps}
          searchTerm="test"
          filterStatus="UNREAD"
        />,
      );
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác",
        ),
      ).toBeInTheDocument();
    });

    it("should show all filters message", () => {
      render(
        <NotificationEmptyState
          {...defaultProps}
          searchTerm="test"
          filterType="CLASS"
          filterStatus="UNREAD"
        />,
      );
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should have correct container classes", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const container = screen
        .getByText("Không có thông báo nào")
        .closest("div");
      expect(container).toHaveClass(
        "bg-white",
        "rounded-2xl",
        "shadow-lg",
        "border",
        "border-gray-100",
        "p-8",
        "sm:p-12",
        "text-center",
      );
    });

    it("should have correct icon container classes", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const iconContainer = screen
        .getByText("Không có thông báo nào")
        .closest("div")
        ?.querySelector("div");
      expect(iconContainer).toHaveClass(
        "w-16",
        "h-16",
        "sm:w-24",
        "sm:h-24",
        "mx-auto",
        "mb-4",
        "sm:mb-6",
        "bg-gradient-to-br",
        "from-gray-100",
        "to-gray-200",
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
      );
    });

    it("should have correct text styling", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const title = screen.getByText("Không có thông báo nào");
      expect(title).toHaveClass(
        "text-lg",
        "sm:text-xl",
        "font-semibold",
        "text-gray-900",
        "mb-2",
      );

      const description = screen.getByText(
        "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.",
      );
      expect(description).toHaveClass(
        "text-sm",
        "sm:text-base",
        "text-gray-600",
        "max-w-md",
        "mx-auto",
      );
    });

    it("should have responsive design classes", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const container = screen
        .getByText("Không có thông báo nào")
        .closest("div");
      expect(container).toHaveClass("p-8", "sm:p-12");
    });
  });

  describe("Icon Rendering", () => {
    it("should render the correct icon for default state", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const icon = screen
        .getByText("Không có thông báo nào")
        .closest("div")
        ?.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(
        "w-8",
        "h-8",
        "sm:w-12",
        "sm:h-12",
        "text-gray-400",
      );
    });

    it("should render search icon when search term is provided", () => {
      render(<NotificationEmptyState {...defaultProps} searchTerm="test" />);
      const icon = screen
        .getByText("Không có thông báo nào")
        .closest("div")
        ?.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(
        "w-8",
        "h-8",
        "sm:w-12",
        "sm:h-12",
        "text-gray-400",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<NotificationEmptyState {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Không có thông báo nào");
    });
  });

  describe("Component Structure", () => {
    it("should have proper component hierarchy", () => {
      render(<NotificationEmptyState {...defaultProps} />);

      // Main container
      const mainContainer = screen
        .getByText("Không có thông báo nào")
        .closest("div");
      expect(mainContainer).toBeInTheDocument();

      // Icon container
      const iconContainer = screen
        .getByText("Không có thông báo nào")
        .closest("div")
        ?.querySelector("div");
      expect(iconContainer).toBeInTheDocument();

      // Text container
      const title = screen.getByText("Không có thông báo nào");
      expect(title).toBeInTheDocument();

      const description = screen.getByText(
        "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.",
      );
      expect(description).toBeInTheDocument();
    });

    it("should have correct spacing between elements", () => {
      render(<NotificationEmptyState {...defaultProps} />);

      const title = screen.getByText("Không có thông báo nào");
      expect(title).toHaveClass("mb-2");

      const description = screen.getByText(
        "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.",
      );
      expect(description).toBeInTheDocument();
    });
  });
});
