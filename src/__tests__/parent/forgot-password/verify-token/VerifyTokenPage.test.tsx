import "@testing-library/jest-dom";
import VerifyTokenPage from "@/app/ui/components/_common/verifyToken/VerifyTokenPage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockPush = jest.fn();
const mockUseRouter = () => ({ push: mockPush });
const mockUseSearchParams = (email: string | undefined = "test@email.com") => ({
  get: (key: string) => (key === "email" ? email : undefined),
});

jest.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock(
  "@/app/ui/components/_common/forgetPassword/FallingImages",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="falling-images" />,
);
jest.mock(
  "@/app/ui/components/_common/verifyToken/VerifyTokenAnimation",
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  () => (props: any) => <div data-testid="verify-token-animation" {...props} />,
);

jest.mock("@/app/lib/services/auth", () => ({
  verifyOtp: jest.fn(() => Promise.resolve()),
}));

describe("VerifyTokenPage", () => {
  const renderWithProvider = (props = {}) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <VerifyTokenPage {...props} />
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders heading, subheading, 6 OTP inputs, and button", () => {
    renderWithProvider();
    expect(screen.getByText(/xác thực mã otp/i)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: /xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("shows error if OTP không đủ 6 số", async () => {
    renderWithProvider();
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /xác nhận/i }));
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("Vui lòng nhập đủ 6 số xác thực"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("calls mutation and redirect on success", async () => {
    renderWithProvider();
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, idx) =>
      fireEvent.change(input, { target: { value: String(idx + 1) } }),
    );
    fireEvent.click(screen.getByRole("button", { name: /xác nhận/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
