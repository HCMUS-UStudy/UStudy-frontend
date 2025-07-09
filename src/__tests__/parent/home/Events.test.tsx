import "@testing-library/jest-dom";
import Events from "@/app/ui/components/user/parent/home/Events";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Events", () => {
  it("renders event cards and the view all button", () => {
    render(<Events />);
    expect(screen.getByText(/sự kiện/i)).toBeInTheDocument();
    expect(screen.getByText(/xem tất cả/i)).toBeInTheDocument();
    // Check for at least 2 event titles
    expect(screen.getByText(/kiểm tra 45 phút môn toán/i)).toBeInTheDocument();
    expect(screen.getByText(/họp phụ huynh học kỳ 2/i)).toBeInTheDocument();
  });
});
