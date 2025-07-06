import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mutateMock = jest.fn();
const onCloseMock = jest.fn();
const toastSuccessMock = jest.fn();
const toastErrorMock = jest.fn();

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: toastSuccessMock, error: toastErrorMock },
  }),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, status: "idle" }),
  };
});

import StudentConfirmRegisterClass from "@/app/ui/components/user/student/class-register/StudentConfirmRegisterClass";

describe("StudentConfirmRegisterClass (logic/UI)", () => {
  const queryClient = new QueryClient();
  const renderWithProvider = (ui: React.ReactElement) =>
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );

  const mockSelectedClass = {
    id: "rc1",
    user: {
      name: "Test User",
      id: "u1",
      genId: "g1",
      email: "test@example.com",
      avatar: "",
    },
    aclass: {
      name: "Lớp Toán",
      id: "c1",
      description: "desc",
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      grade: { id: "g1", name: "10A1" },
      course: { id: "co1", name: "Toán" },
      teacher: [],
    },
    payment: {
      id: "payment-id",
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      status: "PENDING" as "PENDING",
      paymentDate: "2024-01-01",
      invoiceId: "inv1",
    },
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    registerClassStatus: "WAITING" as "WAITING",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders and calls mutation on pay button click", async () => {
    renderWithProvider(
      <StudentConfirmRegisterClass
        isOpen={true}
        onClose={onCloseMock}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectedClass={mockSelectedClass as any}
      />,
    );
    const btn = screen.getByRole("button", { name: /thanh toán ngay/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith("payment-id");
    });
  });

  it("handles edge case: selectedClass thiếu payment", () => {
    const selectedClass = {
      ...mockSelectedClass,
      payment: {
        id: "payment-id",
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        status: "PENDING" as "PENDING",
        paymentDate: "",
        invoiceId: "",
      },
      id: "rc1",
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      registerClassStatus: "WAITING" as "WAITING",
    };
    renderWithProvider(
      <StudentConfirmRegisterClass
        isOpen={true}
        onClose={jest.fn()}
        selectedClass={selectedClass}
      />,
    );
    // Không throw error
    expect(screen.getByText(/học sinh/i)).toBeInTheDocument();
  });

  it("handles edge case: selectedClass thiếu user/aclass", () => {
    const selectedClass = {
      ...mockSelectedClass,
      user: { id: "", genId: "", email: "", name: "", avatar: "" },
      aclass: {
        id: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        grade: { id: "", name: "" },
        course: { id: "", name: "" },
        teacher: [],
      },
      payment: {
        id: "payment-id",
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        status: "PENDING" as "PENDING",
        paymentDate: "",
        invoiceId: "",
      },
      id: "rc1",
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      registerClassStatus: "WAITING" as "WAITING",
    };
    renderWithProvider(
      <StudentConfirmRegisterClass
        isOpen={true}
        onClose={jest.fn()}
        selectedClass={selectedClass}
      />,
    );
    // Không throw error
    expect(screen.getByText(/tên lớp/i)).toBeInTheDocument();
  });
});
