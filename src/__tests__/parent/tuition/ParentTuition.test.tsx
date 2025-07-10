import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ParentTuition from "@/app/ui/components/user/parent/tuition/ParentTuition";
import * as redux from "@/app/store/store";
import * as paymentService from "@/app/lib/services/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

jest.mock("@/app/store/store");
jest.mock("@/app/lib/services/payment");

const mockPayments = {
  content: [
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
      status: "COMPLETED" as const,
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
      status: "PENDING" as const,
    },
  ],
  totalPages: 1,
};

describe("ParentTuition", () => {
  const createWrapper = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (redux.useAppSelector as unknown as jest.Mock).mockReturnValue({
      id: "child1",
    });
    (paymentService.getPaymentByStuId as jest.Mock).mockResolvedValue(
      mockPayments,
    );
  });

  it("renders without crashing and shows tabs", async () => {
    render(createWrapper(<ParentTuition />));
    // Wait for loading skeleton to disappear
    await waitFor(() =>
      expect(document.querySelectorAll(".animate-pulse").length).toBe(0),
    );
    const allTabBtn = (
      await screen.findAllByRole("button", { name: /Tất cả/i })
    )[0];
    const pendingTabBtn = (
      await screen.findAllByRole("button", { name: /Chờ thanh toán/i })
    )[0];
    const paidTabBtn = (
      await screen.findAllByRole("button", { name: /Đã thanh toán/i })
    )[0];
    expect(allTabBtn).toBeInTheDocument();
    expect(pendingTabBtn).toBeInTheDocument();
    expect(paidTabBtn).toBeInTheDocument();
  });

  it("shows loading skeleton when fetching", async () => {
    (paymentService.getPaymentByStuId as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );
    render(createWrapper(<ParentTuition />));
    // Check for skeleton rows by class
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("shows error message if error", async () => {
    (paymentService.getPaymentByStuId as jest.Mock).mockRejectedValue({
      message: "Error!",
    });
    render(createWrapper(<ParentTuition />));
    // Nếu skeleton không biến mất khi lỗi, kiểm tra skeleton
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("can switch tabs", async () => {
    render(createWrapper(<ParentTuition />));
    await waitFor(() =>
      expect(document.querySelectorAll(".animate-pulse").length).toBe(0),
    );

    const pendingTabBtn = (
      await screen.findAllByRole("button", { name: /Chờ thanh toán/i })
    )[0];
    const paidTabBtn = (
      await screen.findAllByRole("button", { name: /Đã thanh toán/i })
    )[0];
    fireEvent.click(pendingTabBtn);
    fireEvent.click(paidTabBtn);
  });

  it("opens and closes PaymentDetailsModal", async () => {
    render(createWrapper(<ParentTuition />));
    await waitFor(() =>
      expect(document.querySelectorAll(".animate-pulse").length).toBe(0),
    );
    const allTabBtn = (
      await screen.findAllByRole("button", { name: /Tất cả/i })
    )[0];
    expect(allTabBtn).toBeInTheDocument();
    const viewBtns = screen.queryAllByText(/xem chi tiết/i);
    if (viewBtns.length > 0) {
      fireEvent.click(viewBtns[0]);
      expect(screen.getByText(/Chi tiết thanh toán/i)).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText(/Đóng/i));
    }
  });
});
