import "@testing-library/jest-dom";
import RegisteredClass from "@/app/ui/components/user/parent/home/RegisteredClass";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("RegisteredClass", () => {
  it("renders all registered classes and the view all button", () => {
    render(<RegisteredClass />);
    expect(screen.getByText(/các lớp đã đăng ký/i)).toBeInTheDocument();
    expect(screen.getByText(/xem tất cả lớp/i)).toBeInTheDocument();
    // Check for at least 3 class names
    expect(screen.getByText(/toán nâng cao lớp 6/i)).toBeInTheDocument();
    expect(screen.getByText(/ngữ văn sáng tạo lớp 6/i)).toBeInTheDocument();
    expect(screen.getByText(/tiếng anh giao tiếp lớp 6/i)).toBeInTheDocument();
  });
});
