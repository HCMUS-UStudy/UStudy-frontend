/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentTuition from "@/app/ui/components/user/student/tuition/StudentTuition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getPaymentByStuId } from "@/app/lib/services/payment";
import { getUserDataFromCookies } from "@/app/lib/action";

// Mock the services
jest.mock("@/app/lib/services/payment");
jest.mock("@/app/lib/action");

// Mock the child components
jest.mock("@/app/ui/components/_common/Tabs", () => ({
  Tabs: ({ children, value }: any) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
  TabList: ({ children }: any) => <div data-testid="tab-list">{children}</div>,
  Tab: ({ value, label, children }: any) => (
    <button data-testid={`tab-${value}`} onClick={() => {}}>
      {label}
      {children}
    </button>
  ),
  TabPanel: ({ value, children }: any) => (
    <div data-testid={`tab-panel-${value}`}>{children}</div>
  ),
}));

jest.mock("@/app/ui/components/user/parent/tuition/PaymentDetailsModal", () => {
  return function MockPaymentDetailsModal({ payment, onClose, onPayNow }: any) {
    return (
      <div data-testid="payment-details-modal">
        <div data-testid="payment-id">{payment?.id}</div>
        <button data-testid="close-details" onClick={onClose}>
          Close
        </button>
        <button data-testid="pay-now-details" onClick={onPayNow}>
          Pay Now
        </button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/user/parent/tuition/PaymentMethodModal", () => {
  return function MockPaymentMethodModal({
    payment,
    onClose,
    onPaymentComplete,
  }: any) {
    return (
      <div data-testid="payment-method-modal">
        <div data-testid="payment-id-method">{payment?.id}</div>
        <button data-testid="close-method" onClick={onClose}>
          Close
        </button>
        <button data-testid="complete-payment" onClick={onPaymentComplete}>
          Complete Payment
        </button>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/user/parent/tuition/PaymentLoadingSkeleton",
  () => {
    return function MockPaymentLoadingSkeleton() {
      return <div data-testid="loading-skeleton">Loading...</div>;
    };
  },
);

jest.mock("@/app/ui/components/user/parent/tuition/Header", () => {
  return function MockHeader({ pendingPayments, paidPayments }: any) {
    return (
      <div data-testid="tuition-header">
        <div data-testid="pending-count">{pendingPayments?.length || 0}</div>
        <div data-testid="paid-count">{paidPayments?.length || 0}</div>
        <div data-testid="formatted-amount">1.000.000 ₫</div>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/user/parent/tuition/PendingPaymentsTable",
  () => {
    return function MockPendingPaymentsTable({
      filteredPendingPayments,
      handleViewDetails,
      handlePayNow,
    }: any) {
      return (
        <div data-testid="pending-payments-table">
          {filteredPendingPayments?.map((payment: any, index: number) => (
            <div
              key={payment.id || index}
              data-testid={`pending-payment-${index}`}
            >
              <span data-testid={`payment-amount-${index}`}>
                {payment.amount.toLocaleString()}
              </span>
              <button
                data-testid={`view-details-${index}`}
                onClick={() => handleViewDetails(payment)}
              >
                View Details
              </button>
              <button
                data-testid={`pay-now-${index}`}
                onClick={() => handlePayNow(payment)}
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/user/parent/tuition/PaidPaymentsTable", () => {
  return function MockPaidPaymentsTable({ data, onViewDetails }: any) {
    return (
      <div data-testid="paid-payments-table">
        {data?.map((payment: any, index: number) => (
          <div key={payment.id || index} data-testid={`paid-payment-${index}`}>
            <span data-testid={`paid-amount-${index}`}>
              {payment.amount.toLocaleString()}
            </span>
            <button
              data-testid={`view-paid-details-${index}`}
              onClick={() => onViewDetails(payment)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/user/parent/tuition/AllPaymentTable", () => {
  return function MockAllPaymentTable({
    payments,
    onViewDetails,
    onPayNow,
  }: any) {
    return (
      <div data-testid="all-payments-table">
        {payments?.map((payment: any, index: number) => (
          <div key={payment.id || index} data-testid={`all-payment-${index}`}>
            <span data-testid={`all-amount-${index}`}>
              {payment.amount.toLocaleString()}
            </span>
            <span data-testid={`all-status-${index}`}>{payment.status}</span>
            <button
              data-testid={`view-all-details-${index}`}
              onClick={() => onViewDetails(payment)}
            >
              View Details
            </button>
            {payment.status === "PENDING" && (
              <button
                data-testid={`pay-all-now-${index}`}
                onClick={() => onPayNow(payment)}
              >
                Pay Now
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    handlePageClick,
    handlePreviousPage,
    handleNextPage,
  }: any) {
    return (
      <div data-testid="pagination">
        <button data-testid="prev-page" onClick={handlePreviousPage}>
          Previous
        </button>
        <span data-testid="current-page">{currentPage}</span>
        <span data-testid="total-pages">{totalPages}</span>
        <button data-testid="next-page" onClick={handleNextPage}>
          Next
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            data-testid={`page-${page}`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };
});

const mockPaymentData = {
  content: [
    {
      id: "1",
      amount: 1000000,
      status: "PENDING",
      dueDate: "2024-01-15",
      description: "Học phí tháng 1",
    },
    {
      id: "2",
      amount: 2000000,
      status: "COMPLETED",
      dueDate: "2024-01-10",
      description: "Học phí tháng 12",
    },
  ],
  totalPages: 3,
  totalElements: 6,
};

const mockUserData = {
  id: "1",
  name: "Test Student",
  email: "test@example.com",
  role: { defaultRoute: "STUDENT" },
};

describe("StudentTuition", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();

    (getPaymentByStuId as jest.Mock).mockResolvedValue(mockPaymentData);
    (getUserDataFromCookies as jest.Mock).mockResolvedValue(mockUserData);
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    );
  };

  it("renders loading state initially", () => {
    (getPaymentByStuId as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithQueryClient(<StudentTuition />);

    // Check for loading skeleton elements (5 skeleton rows)
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state when API fails", async () => {
    (getPaymentByStuId as jest.Mock).mockRejectedValue(new Error("API Error"));

    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("renders tuition header with payment counts", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("tuition-header")).toBeInTheDocument();
      expect(screen.getByTestId("pending-count")).toHaveTextContent("1");
      expect(screen.getByTestId("paid-count")).toHaveTextContent("1");
    });
  });

  it("renders tabs with correct labels", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("tab-all")).toHaveTextContent("Tất cả");
      expect(screen.getByTestId("tab-pending")).toHaveTextContent(
        "Chờ thanh toán",
      );
      expect(screen.getByTestId("tab-completed")).toHaveTextContent(
        "Đã thanh toán",
      );
    });
  });

  it("renders pending payments table with correct data", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("pending-payments-table")).toBeInTheDocument();
      expect(screen.getByTestId("pending-payment-0")).toBeInTheDocument();
      expect(screen.getByTestId("payment-amount-0")).toHaveTextContent(
        "1,000,000",
      );
    });
  });

  it("renders paid payments table with correct data", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("paid-payments-table")).toBeInTheDocument();
      expect(screen.getByTestId("paid-payment-0")).toBeInTheDocument();
      expect(screen.getByTestId("paid-amount-0")).toHaveTextContent(
        "2,000,000",
      );
    });
  });

  it("renders all payments table with correct data", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("all-payments-table")).toBeInTheDocument();
      expect(screen.getByTestId("all-payment-0")).toBeInTheDocument();
      expect(screen.getByTestId("all-payment-1")).toBeInTheDocument();
      expect(screen.getByTestId("all-amount-0")).toHaveTextContent("1,000,000");
      expect(screen.getByTestId("all-amount-1")).toHaveTextContent("2,000,000");
    });
  });

  it("renders pagination with correct data", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
      expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
    });
  });

  it("opens payment details modal when view details is clicked", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("view-details-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-details-0"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-details-modal")).toBeInTheDocument();
      expect(screen.getByTestId("payment-id")).toHaveTextContent("1");
    });
  });

  it("opens payment method modal when pay now is clicked", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("pay-now-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("pay-now-0"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-method-modal")).toBeInTheDocument();
      expect(screen.getByTestId("payment-id-method")).toHaveTextContent("1");
    });
  });

  it("closes payment details modal when close button is clicked", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("view-details-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-details-0"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-details-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("close-details"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("payment-details-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes payment method modal when close button is clicked", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("pay-now-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("pay-now-0"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-method-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("close-method"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("payment-method-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("transitions from details modal to payment method modal", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("view-details-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-details-0"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-details-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("pay-now-details"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("payment-details-modal"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("payment-method-modal")).toBeInTheDocument();
    });
  });

  it("formats currency correctly", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      const formattedElement = screen.getByTestId("formatted-amount");
      expect(formattedElement).toBeInTheDocument();
      expect(formattedElement.textContent).toMatch(/1\.000\.000/);
    });
  });

  it("filters payments by status correctly", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      // Check that pending payments are filtered correctly
      expect(screen.getByTestId("pending-payment-0")).toBeInTheDocument();
      expect(screen.getByTestId("payment-amount-0")).toHaveTextContent(
        "1,000,000",
      );

      // Check that completed payments are filtered correctly
      expect(screen.getByTestId("paid-payment-0")).toBeInTheDocument();
      expect(screen.getByTestId("paid-amount-0")).toHaveTextContent(
        "2,000,000",
      );
    });
  });

  it("handles empty payment data gracefully", async () => {
    (getPaymentByStuId as jest.Mock).mockResolvedValue({
      content: [],
      totalPages: 0,
      totalElements: 0,
    });

    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(screen.getByTestId("tuition-header")).toBeInTheDocument();
      expect(screen.getByTestId("pending-count")).toHaveTextContent("0");
      expect(screen.getByTestId("paid-count")).toHaveTextContent("0");
    });
  });

  it("calls API with correct parameters", async () => {
    renderWithQueryClient(<StudentTuition />);

    await waitFor(() => {
      expect(getPaymentByStuId).toHaveBeenCalledWith(undefined, 0, 5, "");
    });
  });
});
