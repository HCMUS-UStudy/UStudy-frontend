import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentDetailsModal from "@/app/ui/components/user/parent/tuition/PaymentDetailsModal";
import "@testing-library/jest-dom";

describe("PaymentDetailsModal", () => {
  const mockPayment = {
    id: "1",
    paymentDate: "2024-01-01T00:00:00.000Z",
    invoiceId: "INV-001",
    amount: 100000,
    student: {
      id: "stu-1",
      genId: "G1",
      email: "student@example.com",
      name: "Student Name",
      avatar: "avatar.png",
    },
    classDto: {
      id: "class-1",
      name: "Class Name",
      course: { id: "course-1", name: "Course Name" },
      grade: { id: "grade-1", name: "Grade Name" },
    },
    status: "PENDING" as const,
  };
  it("renders payment details and calls callbacks", () => {
    const onClose = jest.fn();
    const onPayNow = jest.fn();
    render(
      <PaymentDetailsModal
        payment={mockPayment}
        onClose={onClose}
        onPayNow={onPayNow}
      />,
    );
    // Use getAllByText to avoid multiple match error
    expect(screen.getAllByText(/chi tiết/i)[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText(/đóng/i));
    expect(onClose).toHaveBeenCalled();
    const payBtns = screen.getAllByText(
      (content, node) =>
        node !== null && node.textContent === "Thanh toán ngay",
    );
    expect(payBtns.length).toBeGreaterThan(0);
    fireEvent.click(payBtns[0]);
    expect(onPayNow).toHaveBeenCalled();
  });
});
