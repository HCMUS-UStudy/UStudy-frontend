import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationEmptyState from "@/app/ui/components/admin/notifications/NotificationEmptyState";

describe("NotificationEmptyState", () => {
  it("renders default text", () => {
    render(
      <NotificationEmptyState
        searchTerm=""
        filterType="ALL"
        filterStatus="ALL"
      />,
    );
    expect(screen.getByText(/không có thông báo nào/i)).toBeInTheDocument();
    expect(screen.getByText(/bạn chưa có thông báo nào/i)).toBeInTheDocument();
  });
});
