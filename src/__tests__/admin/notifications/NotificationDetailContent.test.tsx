/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationDetailContent from "@/app/ui/components/admin/notifications/NotificationDetailContent";

// Mock next/image
// eslint-disable-next-line jsx-a11y/alt-text, react/display-name
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("NotificationDetailContent", () => {
  const mockNotification = {
    id: "1",
    title: "Test Notification Title",
    content:
      "This is a test notification content with detailed information about the notification.",
    sender: { name: "Admin User", avatar: "/test.png" },
    receiverType: "SYSTEM",
    type: "SYSTEM",
    sendDate: "2024-01-01T10:00:00Z",
    read: false,
    className: "Test Class",
  };

  it("renders notification title and content", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    expect(screen.getByText("Test Notification Title")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is a test notification content with detailed information about the notification.",
      ),
    ).toBeInTheDocument();
  });

  it("shows sender information", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Người gửi")).toBeInTheDocument();
  });

  it("shows unread badge when notification is unread", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    expect(screen.getByText("Chưa đọc")).toBeInTheDocument();
  });

  it("does not show unread badge when notification is read", () => {
    const readNotification = { ...mockNotification, read: true };
    render(
      <NotificationDetailContent notification={readNotification as any} />,
    );
    expect(screen.queryByText("Chưa đọc")).not.toBeInTheDocument();
  });

  it("shows correct type label for SYSTEM", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    expect(screen.getByText("Hệ thống")).toBeInTheDocument();
  });

  it("shows correct type label for CLASS", () => {
    const classNotification = { ...mockNotification, receiverType: "CLASS" };
    render(
      <NotificationDetailContent notification={classNotification as any} />,
    );
    expect(screen.getByText("Lớp Test Class")).toBeInTheDocument();
  });

  it("shows correct type label for USER", () => {
    const userNotification = { ...mockNotification, receiverType: "USER" };
    render(
      <NotificationDetailContent notification={userNotification as any} />,
    );
    expect(screen.getByText("Cá nhân")).toBeInTheDocument();
  });

  it("shows send date information", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    expect(screen.getByText("Gửi lúc")).toBeInTheDocument();
    // The actual date format will depend on the formatDate function
    expect(screen.getAllByText(/01\/01\/2024/).length).toBeGreaterThan(0);
  });

  it("renders with correct structure", () => {
    render(
      <NotificationDetailContent notification={mockNotification as any} />,
    );
    // Check for main content sections
    expect(screen.getByText("Test Notification Title")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Hệ thống")).toBeInTheDocument();
  });
});
