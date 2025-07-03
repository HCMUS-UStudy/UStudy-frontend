import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminResetPasswordPage from "@/app/(admin)/admin/reset-password/page";

const mockMutate = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({
    get: (key: string) => (key === "email" ? "test@example.com" : "123456"),
  }),
}));
jest.mock("@/app/lib/services/auth", () => ({
  forgotPasswordWithOtp: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ mutate: mockMutate }),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { error: jest.fn(), success: jest.fn() },
  }),
}));

describe("Admin ResetPassword Page", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders the reset password form", () => {
    render(<AdminResetPasswordPage />);
    expect(screen.getAllByText(/Đặt lại mật khẩu/i).length).toBeGreaterThan(0);
    expect(
      screen.getByPlaceholderText(/Nhập mật khẩu mới/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nhập lại mật khẩu mới/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("does not call mutation when submitting empty form", async () => {
    render(<AdminResetPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /Xác nhận/i }));
    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("shows error when passwords do not match", async () => {
    render(<AdminResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu mới/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nhập lại mật khẩu mới/i), {
      target: { value: "password456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Xác nhận/i }));
    await waitFor(() => {
      expect(
        screen.getAllByText(/Mật khẩu xác nhận không khớp/i).length,
      ).toBeGreaterThan(0);
    });
  });

  it("submits form with valid passwords", async () => {
    render(<AdminResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu mới/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nhập lại mật khẩu mới/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Xác nhận/i }));
    await waitFor(() => {
      expect(screen.queryAllByText(/Vui lòng nhập mật khẩu mới/i).length).toBe(
        0,
      );
      expect(
        screen.queryAllByText(/Mật khẩu xác nhận không khớp/i).length,
      ).toBe(0);
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
