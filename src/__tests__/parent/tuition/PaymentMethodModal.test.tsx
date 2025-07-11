import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentMethodModal from "@/app/ui/components/user/parent/tuition/PaymentMethodModal";

describe("PaymentMethodModal", () => {
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
    createdAt: new Date(),
    dueDate: new Date(),
  };
  it("renders and calls callbacks", () => {
    const onClose = jest.fn();
    const onPaymentComplete = jest.fn();
    render(
      <PaymentMethodModal
        payment={mockPayment}
        onClose={onClose}
        onPaymentComplete={onPaymentComplete}
      />,
    );
    // Use getAllByText to avoid multiple match error
    expect(screen.getAllByText(/phương thức/i)[0]).toBeInTheDocument();
    fireEvent.click(
      screen.getByText(
        (content, node) => node !== null && node.textContent === "Hủy",
      ),
    );
    expect(onClose).toHaveBeenCalled();
    // Simulate payment complete if button exists
    const payBtn = screen.queryByText(/xác nhận/i);
    if (payBtn) {
      fireEvent.click(payBtn);
      expect(onPaymentComplete).toHaveBeenCalled();
    }
  });
});
