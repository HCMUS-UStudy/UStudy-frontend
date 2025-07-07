import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationHeader from "@/app/ui/components/admin/notifications/NotificationHeader";
import "@testing-library/jest-dom";

// Mock Button component
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, className, variant }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="refresh-button"
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

describe("NotificationHeader", () => {
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the header with correct title and description", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      expect(screen.getByText("Thông báo")).toBeInTheDocument();
      expect(
        screen.getByText("Quản lý và xem tất cả thông báo của bạn"),
      ).toBeInTheDocument();
    });

    it("should render the refresh button", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByText("Làm mới")).toBeInTheDocument();
    });

    it("should render the refresh icon", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      expect(refreshButton).toBeInTheDocument();

      // Check if the SVG icon is present
      const svg = refreshButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should have correct styling classes", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const header = screen
        .getByText("Thông báo")
        .closest(".relative.rounded-t-lg");
      expect(header).toHaveClass(
        "relative",
        "rounded-t-lg",
        "overflow-hidden",
        "bg-primary-dark",
        "shadow-xl",
      );
    });
  });

  describe("Refresh Functionality", () => {
    it("should call onRefresh when refresh button is clicked", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      fireEvent.click(refreshButton);

      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it("should call onRefresh multiple times when button is clicked multiple times", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);

      expect(mockOnRefresh).toHaveBeenCalledTimes(3);
    });
  });

  describe("Button Properties", () => {
    it("should pass correct props to Button component", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      expect(refreshButton).toHaveAttribute("data-variant", "basic");
      expect(refreshButton).toHaveClass("flex", "items-center", "gap-2");
    });

    it("should have correct button text and icon", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      expect(refreshButton).toHaveTextContent("Làm mới");

      // Check for the refresh icon SVG
      const svg = refreshButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive text classes", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const title = screen.getByText("Thông báo");
      expect(title).toHaveClass("text-xl", "sm:text-2xl");

      const description = screen.getByText(
        "Quản lý và xem tất cả thông báo của bạn",
      );
      expect(description).toHaveClass("text-sm", "sm:text-md");
    });

    it("should have responsive padding classes", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const container = screen.getByText("Thông báo").closest(".relative.px-4");
      expect(container).toHaveClass("px-4", "sm:px-6", "py-6", "sm:py-8");
    });

    it("should have responsive layout classes", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const layoutContainer = screen
        .getByText("Thông báo")
        .closest(".flex.flex-col");
      expect(layoutContainer).toHaveClass(
        "flex",
        "flex-col",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Thông báo");
    });

    it("should have accessible button", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Làm mới");
    });
  });

  describe("Visual Elements", () => {
    it("should have background overlay", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const overlay = screen
        .getByText("Thông báo")
        .closest(".relative.rounded-t-lg")
        ?.querySelector(".absolute");
      expect(overlay).toHaveClass("bg-black/10");
    });

    it("should have gradient background", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const header = screen
        .getByText("Thông báo")
        .closest(".relative.rounded-t-lg");
      expect(header).toHaveClass("bg-primary-dark");
    });

    it("should have shadow effect", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const header = screen
        .getByText("Thông báo")
        .closest(".relative.rounded-t-lg");
      expect(header).toHaveClass("shadow-xl");
    });
  });

  describe("Icon Animation", () => {
    it("should have hover animation classes on icon", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByTestId("refresh-button");
      const svg = refreshButton.querySelector("svg");
      expect(svg).toHaveClass(
        "transition-transform",
        "group-hover:animate-spin",
      );
    });
  });

  describe("Component Structure", () => {
    it("should have proper component hierarchy", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      // Main container
      const mainContainer = screen
        .getByText("Thông báo")
        .closest(".relative.rounded-t-lg");
      expect(mainContainer).toBeInTheDocument();

      // Content container
      const contentContainer = mainContainer?.querySelector(".relative.px-4");
      expect(contentContainer).toBeInTheDocument();

      // Layout container
      const layoutContainer = contentContainer?.querySelector(".flex.flex-col");
      expect(layoutContainer).toBeInTheDocument();
    });

    it("should have text and button sections", () => {
      render(<NotificationHeader onRefresh={mockOnRefresh} />);

      const textSection = screen.getByText("Thông báo").closest(".text-white");
      expect(textSection).toBeInTheDocument();

      const buttonSection = screen
        .getByTestId("refresh-button")
        .closest(".flex");
      expect(buttonSection).toBeInTheDocument();
    });
  });
});
