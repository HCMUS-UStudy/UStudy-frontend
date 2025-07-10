import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AllPaymentTable from "@/app/ui/components/user/parent/tuition/AllPaymentTable";
import "@testing-library/jest-dom";

describe("AllPaymentTable", () => {
  const mockPayments = [
    {
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
    },
    {
      id: "2",
      paymentDate: "2024-01-02T00:00:00.000Z",
      invoiceId: "INV-002",
      amount: 200000,
      student: {
        id: "stu-2",
        genId: "G2",
        email: "student2@example.com",
        name: "Student 2",
        avatar: "avatar2.png",
      },
      classDto: {
        id: "class-2",
        name: "Class 2",
        course: { id: "course-2", name: "Course 2" },
        grade: { id: "grade-2", name: "Grade 2" },
      },
      status: "COMPLETED" as const,
    },
  ];
  it("renders all payments and calls callbacks", () => {
    const onViewDetails = jest.fn();
    const onPayNow = jest.fn();
    render(
      <AllPaymentTable
        payments={mockPayments}
        onViewDetails={onViewDetails}
        onPayNow={onPayNow}
        formatCurrency={(a) => `${a}₫`}
        formatDate={() => "date"}
        getStatusName={(s) => s}
        getStatusColor={() => "text"}
      />,
    );
    expect(screen.getByText(/100000₫/)).toBeInTheDocument();
    expect(screen.getByText(/200000₫/)).toBeInTheDocument();
    const allButtons = screen.getAllByRole("button");
    // Button đầu tiên là 'Xem chi tiết' (icon), thứ hai là 'Thanh toán'
    expect(allButtons.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(allButtons[0]);
    expect(onViewDetails).toHaveBeenCalled();
    fireEvent.click(allButtons[1]);
    expect(onPayNow).toHaveBeenCalled();
  });
});
