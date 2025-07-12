import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/app/ui/components/user/parent/tuition/Header";
import "@testing-library/jest-dom";

describe("Header", () => {
  it("renders pending and paid payments info", () => {
    render(
      <Header
        pendingPayments={[
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
            status: "PENDING",
          },
        ]}
        paidPayments={[
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
            status: "COMPLETED",
          },
        ]}
        formatCurrency={(a) => `${a}₫`}
      />,
    );
    expect(screen.getByText(/100000₫/)).toBeInTheDocument();
    expect(screen.getByText(/200000₫/)).toBeInTheDocument();
  });
});
