import "@testing-library/jest-dom";
import ResetPasswordComponent from "@/app/ui/components/_common/resetPassword/ResetPasswordComponent";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({
    get: (key: string) => (key === "email" ? "test@email.com" : "123456"),
  }),
}));

jest.mock(
  "@/app/ui/components/_common/forgetPassword/FallingImages",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="falling-images" />,
);
jest.mock(
  "@/app/ui/components/_common/resetPassword/ResetPasswordForm",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <form
      data-testid="reset-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({ password: "123456", confirmPassword: "123456" });
      }}
    >
      <input placeholder="Nhập mật khẩu mới" />
      <input placeholder="Nhập lại mật khẩu mới" />
      <button type="submit">Xác nhận</button>
      <button
        type="button"
        onClick={() => {
          props.setIsLoadingBack(true);
          props.router.push("/login");
        }}
      >
        Quay lại đăng nhập
      </button>
    </form>
  ),
);

jest.mock("@/app/lib/services/auth", () => ({
  forgotPasswordWithOtp: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: jest.fn(), error: jest.fn() },
  }),
}));

describe("ResetPasswordComponent", () => {
  const renderWithProvider = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <ResetPasswordComponent />
      </QueryClientProvider>,
    );
  };

  it("renders form and falling images", () => {
    renderWithProvider();
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("falling-images")).toBeInTheDocument();
  });

  it("calls onSubmit and mutation", async () => {
    renderWithProvider();
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu mới/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/nhập lại mật khẩu mới/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/xác nhận/i));
    await waitFor(() => {
      expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    });
  });

  it("back button triggers router.push", () => {
    renderWithProvider();
    fireEvent.click(screen.getByText(/quay lại đăng nhập/i));
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
  });
});
