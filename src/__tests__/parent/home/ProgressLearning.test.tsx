import "@testing-library/jest-dom";
import ProgressLearning from "@/app/ui/components/user/parent/home/ProgressLearning";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("ProgressLearning", () => {
  it("renders all children progress cards and the detail button", () => {
    render(<ProgressLearning />);
    expect(screen.getByText(/tiến độ học tập của con/i)).toBeInTheDocument();
    expect(screen.getByText(/xem chi tiết/i)).toBeInTheDocument();
    // Check for at least 3 subjects (Toán, Lý, Hóa)
    expect(screen.getByText(/toán/i)).toBeInTheDocument();
    expect(screen.getByText(/lý/i)).toBeInTheDocument();
    expect(screen.getByText(/hóa/i)).toBeInTheDocument();
  });
});
