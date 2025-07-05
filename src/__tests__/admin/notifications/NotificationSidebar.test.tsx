/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationSidebar from "@/app/ui/components/admin/notifications/NotificationSidebar";

// Mock next/image
// eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element, react/display-name
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("NotificationSidebar", () => {
  const mockNotifications = [
    {
      id: "1",
      title: "Test Notification 1",
      content: "Test content 1",
      sender: { name: "Admin", avatar: "/test.png" },
      receiverType: "SYSTEM",
      type: "SYSTEM",
      sendDate: "2024-01-01T10:00:00Z",
      read: false,
      className: "Test Class",
    },
    {
      id: "2",
      title: "Test Notification 2",
      content: "Test content 2",
      sender: { name: "Teacher", avatar: "/test2.png" },
      receiverType: "CLASS",
      type: "CLASS",
      sendDate: "2024-01-02T10:00:00Z",
      read: true,
      className: "Math Class",
    },
  ];

  const defaultProps = {
    sidebarOpen: true,
    allNotifications: mockNotifications as any,
    currentNotificationId: "1",
    navigating: false,
    onNotificationClick: jest.fn(),
    onCloseSidebar: jest.fn(),
  };

  it("renders sidebar with notifications", () => {
    render(<NotificationSidebar {...defaultProps} />);
    expect(screen.getAllByText("Danh sách thông báo").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("Test Notification 1")).toBeInTheDocument();
    expect(screen.getByText("Test Notification 2")).toBeInTheDocument();
  });

  it("calls onNotificationClick when notification is clicked", () => {
    const onNotificationClick = jest.fn();
    render(
      <NotificationSidebar
        {...defaultProps}
        onNotificationClick={onNotificationClick}
      />,
    );
    fireEvent.click(screen.getByText("Test Notification 1"));
    expect(onNotificationClick).toHaveBeenCalledWith("1");
  });

  it("calls onCloseSidebar when close button is clicked", () => {
    const onCloseSidebar = jest.fn();
    render(
      <NotificationSidebar {...defaultProps} onCloseSidebar={onCloseSidebar} />,
    );
    // Find close button by its class and click it
    const closeButton = screen.getByRole("button", { name: "" });
    fireEvent.click(closeButton);
    expect(onCloseSidebar).toHaveBeenCalled();
  });

  it("shows correct type labels", () => {
    render(<NotificationSidebar {...defaultProps} />);
    expect(screen.getByText("Hệ thống")).toBeInTheDocument();
    expect(screen.getByText("Lớp Math Class")).toBeInTheDocument();
  });

  it("disables interactions when navigating", () => {
    render(<NotificationSidebar {...defaultProps} navigating={true} />);
    const notification = screen.getByText("Test Notification 1");
    expect(
      notification.closest('[class*="pointer-events-none"]'),
    ).toBeInTheDocument();
  });

  it("applies correct classes for active notification", () => {
    render(<NotificationSidebar {...defaultProps} />);
    const activeNotification = screen.getByText("Test Notification 1");
    const card = activeNotification.closest('[class*="border-primary-dark"]');
    expect(card).toBeInTheDocument();
  });

  it("applies correct classes for read notification", () => {
    render(<NotificationSidebar {...defaultProps} />);
    const readNotification = screen.getByText("Test Notification 2");
    const card = readNotification.closest(
      '[class*="hover:border-primary-light"]',
    );
    expect(card).toBeInTheDocument();
  });

  it("hides sidebar on mobile when sidebarOpen is false", () => {
    render(<NotificationSidebar {...defaultProps} sidebarOpen={false} />);
    const sidebar = screen
      .getAllByText("Danh sách thông báo")[0]
      .closest('[class*="-translate-x-full"]');
    expect(sidebar).toBeInTheDocument();
  });
});
