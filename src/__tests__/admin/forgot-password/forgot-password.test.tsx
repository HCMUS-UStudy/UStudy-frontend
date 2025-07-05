import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPassword from "@/app/(admin)/admin/forgot-password/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/app/lib/services/auth", () => ({
  generateOtp: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { error: jest.fn(), success: jest.fn() },
  }),
}));

describe("Admin ForgotPassword Page", () => {
  it("renders the forgot password form", () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Quên mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nhập email của bạn/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Gửi email xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty form", async () => {
    render(<ForgotPassword />);
    fireEvent.click(
      screen.getByRole("button", { name: /Gửi email xác nhận/i }),
    );
    await waitFor(() => {
      expect(screen.getByText(/Email không hợp lệ/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid email", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/Nhập email của bạn/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(
      screen.getByRole("button", { name: /Gửi email xác nhận/i }),
    );
    // No error should be shown
    await waitFor(() => {
      expect(
        screen.queryByText(/Vui lòng nhập email/i),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Email không hợp lệ/i)).not.toBeInTheDocument();
    });
  });
});
