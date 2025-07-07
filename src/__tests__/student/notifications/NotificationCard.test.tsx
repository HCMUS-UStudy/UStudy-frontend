import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationCard from "@/app/ui/components/admin/notifications/NotificationCard";
import { NotificationItem } from "@/app/types";
import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="avatar-image" />;
  };
});

// Mock Card component
jest.mock("@/app/ui/components/_common/Card", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children, className, onClick, style }: any) => (
    <div
      className={className}
      onClick={onClick}
      style={style}
      data-testid="notification-card"
    >
      {children}
    </div>
  ),
}));

const mockNotification: NotificationItem = {
  id: "1",
  title: "System Maintenance",
  content: "System will be down for maintenance on Sunday",
  sendDate: "2024-01-15T10:00:00Z",
  read: false,
  sender: {
    id: "1",
    genId: "gen1",
    name: "System Admin",
    avatar: "/avatars/admin.png",
    email: "admin@example.com",
  },
  type: "ANNOUNCEMENT",
  receiverType: "SYSTEM",
};

const mockOnClick = jest.fn();

describe("NotificationCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render notification card with basic information", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByTestId("notification-card")).toBeInTheDocument();
      expect(screen.getByText("System Maintenance")).toBeInTheDocument();
      expect(
        screen.getByText("System will be down for maintenance on Sunday"),
      ).toBeInTheDocument();
    });

    it("should render sender information", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("System Admin")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-image")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-image")).toHaveAttribute(
        "src",
        "/avatars/admin.png",
      );
    });

    it("should render unread status for unread notifications", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });

    it("should not render unread status for read notifications", () => {
      const readNotification = { ...mockNotification, read: true };

      render(
        <NotificationCard
          notification={readNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.queryByText("Chưa đọc")).not.toBeInTheDocument();
    });
  });

  describe("Notification Types", () => {
    it("should render SYSTEM type notification correctly", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("Hệ thống")).toBeInTheDocument();
    });

    it("should render CLASS type notification correctly", () => {
      const classNotification = {
        ...mockNotification,
        receiverType: "CLASS",
        className: "Math 101",
      };

      render(
        <NotificationCard
          notification={classNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("Lớp Math 101")).toBeInTheDocument();
    });

    it("should render USER type notification correctly", () => {
      const userNotification = {
        ...mockNotification,
        receiverType: "USER",
      };

      render(
        <NotificationCard
          notification={userNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("Cá nhân")).toBeInTheDocument();
    });

    it("should render unknown type notification correctly", () => {
      const unknownNotification = {
        ...mockNotification,
        receiverType: "UNKNOWN",
      };

      render(
        <NotificationCard
          notification={unknownNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("should call onClick when card is clicked", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledWith(mockNotification);
    });

    it("should call onClick multiple times when card is clicked multiple times", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      fireEvent.click(card);
      fireEvent.click(card);
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct classes for unread notification", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveClass(
        "border-l-4",
        "border-l-red-500",
        "bg-gradient-to-r",
        "from-red-50",
        "to-white",
      );
    });

    it("should have correct classes for read notification", () => {
      const readNotification = { ...mockNotification, read: true };

      render(
        <NotificationCard
          notification={readNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveClass("hover:border-primary", "bg-white");
    });

    it("should have cursor pointer class", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveClass("cursor-pointer");
    });

    it("should have hover effects", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveClass("hover:shadow-2xl", "hover:scale-[1.02]");
    });
  });

  describe("Animation", () => {
    it("should have animation delay based on index", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={2}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveStyle({ animationDelay: "100ms" });
    });

    it("should have slideInUp animation", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const card = screen.getByTestId("notification-card");
      expect(card).toHaveStyle({
        animationName: "slideInUp",
        animationDuration: "0.5s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
      });
    });
  });

  describe("Date Formatting", () => {
    it("should format recent date correctly", () => {
      const recentNotification = {
        ...mockNotification,
        sendDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      };

      render(
        <NotificationCard
          notification={recentNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("30 phút trước")).toBeInTheDocument();
    });

    it("should format hours ago correctly", () => {
      const hoursAgoNotification = {
        ...mockNotification,
        sendDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      };

      render(
        <NotificationCard
          notification={hoursAgoNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("3 giờ trước")).toBeInTheDocument();
    });

    it("should format yesterday correctly", () => {
      const yesterdayNotification = {
        ...mockNotification,
        sendDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
      };

      render(
        <NotificationCard
          notification={yesterdayNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(screen.getByText("Hôm qua")).toBeInTheDocument();
    });

    it("should format older dates correctly", () => {
      const oldNotification = {
        ...mockNotification,
        sendDate: "2024-01-10T10:00:00Z",
      };

      render(
        <NotificationCard
          notification={oldNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      // Should show formatted date
      expect(screen.getByText(/10\/01\/2024/)).toBeInTheDocument();
    });
  });

  describe("Current Notification Highlighting", () => {
    it("should not show unread badge for current notification", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
          currentNotificationId="1"
        />,
      );

      expect(screen.queryByText("Chưa đọc")).not.toBeInTheDocument();
    });

    it("should show unread badge for non-current unread notification", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
          currentNotificationId="2"
        />,
      );

      expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
    });
  });

  describe("Content Truncation", () => {
    it("should render content when available", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(
        screen.getByText("System will be down for maintenance on Sunday"),
      ).toBeInTheDocument();
    });

    it("should handle notification without content", () => {
      const notificationWithoutContent = {
        ...mockNotification,
        content: "",
      };

      render(
        <NotificationCard
          notification={notificationWithoutContent}
          index={0}
          onClick={mockOnClick}
        />,
      );

      expect(
        screen.queryByText("System will be down for maintenance on Sunday"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive text classes", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const title = screen.getByText("System Maintenance");
      expect(title).toHaveClass("text-lg", "sm:text-xl");
    });

    it("should have responsive layout classes", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const contentContainer = screen
        .getByTestId("notification-card")
        .querySelector(".flex.flex-col");
      expect(contentContainer).toHaveClass("flex", "flex-col", "sm:flex-row");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("System Maintenance");
    });

    it("should have accessible avatar image", () => {
      render(
        <NotificationCard
          notification={mockNotification}
          index={0}
          onClick={mockOnClick}
        />,
      );

      const avatar = screen.getByTestId("avatar-image");
      expect(avatar).toHaveAttribute("alt");
    });
  });
});
