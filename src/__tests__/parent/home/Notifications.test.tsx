import "@testing-library/jest-dom";
import Notifications from "@/app/ui/components/user/parent/home/Notifications";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Notifications", () => {
  it("renders notification cards and the view all button", () => {
    render(<Notifications />);
    // Use exact match for the main heading
    expect(screen.getByText(/^thông báo$/i)).toBeInTheDocument();
    expect(screen.getByText(/xem tất cả/i)).toBeInTheDocument();
    // Check for at least 2 notification titles
    expect(
      screen.getAllByText(/thông báo học phí tháng 5/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/lịch nghỉ lễ 30\/4 - 1\/5/i).length,
    ).toBeGreaterThan(0);
  });
});
