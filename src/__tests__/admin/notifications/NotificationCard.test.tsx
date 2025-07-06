/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationCard from "@/app/ui/components/admin/notifications/NotificationCard";

// Mock next/image để tránh lỗi thiếu src
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("NotificationCard", () => {
  const notification = {
    id: "1",
    title: "Test Title",
    content: "Test Content",
    sender: { name: "Admin", avatar: "/test.png" },
    receiverType: "STUDENT",
    type: "STUDENT",
    sendDate: "2024-01-01T10:00:00Z",
    read: false,
  };
  it("renders notification info", () => {
    render(
      <NotificationCard
        notification={notification as any}
        index={0}
        onClick={jest.fn()}
        currentNotificationId={"1"}
      />,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/student/i)).toBeInTheDocument();
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });
  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(
      <NotificationCard
        notification={notification as any}
        index={0}
        onClick={onClick}
        currentNotificationId={"1"}
      />,
    );
    fireEvent.click(screen.getByText("Test Title"));
    expect(onClick).toHaveBeenCalled();
  });
  it("shows unread class if unread", () => {
    const { container } = render(
      <NotificationCard
        notification={notification as any}
        index={0}
        onClick={jest.fn()}
        currentNotificationId={"1"}
      />,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-l-red-500");
  });
  it("shows read class if read", () => {
    const { container } = render(
      <NotificationCard
        notification={{ ...notification, read: true } as any}
        index={0}
        onClick={jest.fn()}
        currentNotificationId={"1"}
      />,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("hover:border-primary");
  });
});
