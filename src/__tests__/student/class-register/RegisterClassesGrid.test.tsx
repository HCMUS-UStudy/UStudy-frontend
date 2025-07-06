import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterClassesGrid from "@/app/ui/components/user/student/classes/RegisterClassesGrid";

describe("RegisterClassesGrid (logic/UI)", () => {
  const validClasses = {
    content: [
      {
        classDto: {
          id: "1",
          name: "Lớp Toán",
          description: "desc",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          grade: { id: "g1", name: "10A1" },
          course: { id: "c1", name: "Toán" },
          teacher: [],
        },
        payment: {
          id: "p1",
          status: "PENDING",
          paymentDate: "",
          invoiceId: "",
        },
        status: "WAITING",
      },
      {
        classDto: {
          id: "2",
          name: "Lớp Văn",
          description: "desc",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          grade: { id: "g2", name: "10A2" },
          course: { id: "c2", name: "Văn" },
          teacher: [],
        },
        payment: {
          id: "p2",
          status: "COMPLETED",
          paymentDate: "",
          invoiceId: "",
        },
        status: "ACCEPTED",
      },
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 2,
    last: true,
  };

  it("renders class list", () => {
    render(
      <RegisterClassesGrid
        status="success"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classes={validClasses as any}
        paymentPendingId={null}
      />,
    );
    expect(screen.getByText(/lớp toán/i)).toBeInTheDocument();
    expect(screen.getByText(/lớp văn/i)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <RegisterClassesGrid
        status="success"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classes={{ ...validClasses, content: [], totalElements: 0 } as any}
        paymentPendingId={null}
      />,
    );
    expect(screen.getByText(/không có lớp học/i)).toBeInTheDocument();
  });

  it("handles edge case: classes is undefined", () => {
    render(
      <RegisterClassesGrid
        status="success"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classes={undefined as any}
        paymentPendingId={null}
      />,
    );
    expect(screen.getByText(/không có lớp học/i)).toBeInTheDocument();
  });

  it("renders loading state when status is pending", () => {
    render(
      <RegisterClassesGrid
        status="pending"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classes={validClasses as any}
        paymentPendingId={null}
      />,
    );
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("handles paymentPendingId edge case", () => {
    render(
      <RegisterClassesGrid
        status="success"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classes={validClasses as any}
        paymentPendingId={"1"}
      />,
    );
    expect(screen.getByText(/lớp toán/i)).toBeInTheDocument();
  });
});
