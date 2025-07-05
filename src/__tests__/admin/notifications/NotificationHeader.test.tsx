import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationHeader from "@/app/ui/components/admin/notifications/NotificationHeader";

describe("NotificationHeader", () => {
  it("renders title", () => {
    render(<NotificationHeader onRefresh={jest.fn()} />);
    expect(
      screen.getAllByText(
        (content, node) => node?.textContent?.includes("Thông báo") ?? false,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const onRefresh = jest.fn();
    render(<NotificationHeader onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRefresh).toHaveBeenCalled();
  });
});
