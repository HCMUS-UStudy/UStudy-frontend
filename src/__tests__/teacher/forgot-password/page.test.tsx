import "@testing-library/jest-dom";
import ForgotPassword from "@/app/(auth)/forgot-password/page";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("ForgotPassword page", () => {
  it("renders logo, form, and falling images", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ForgotPassword />
      </QueryClientProvider>,
    );
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/quên mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByText(/gửi email xác nhận/i)).toBeInTheDocument();
    expect(
      screen.getByText(/nhập email để nhận hướng dẫn đặt lại mật khẩu/i),
    ).toBeInTheDocument();
  });
});
