import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordForm from "@/app/ui/components/_common/forgetPassword/ForgotPasswordForm";

const mockOnSubmit = jest.fn();
const mockRegister = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHandleSubmit = (fn: any) => (e: any) => fn(e);
const mockRouter = { push: jest.fn() };
const mockSetIsLoadingBack = jest.fn();

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email input and submit button", () => {
    render(
      <ForgotPasswordForm
        onSubmit={mockOnSubmit}
        errors={{}}
        register={mockRegister}
        isLoading={false}
        isLoadingBack={false}
        router={mockRouter}
        setIsLoadingBack={mockSetIsLoadingBack}
        handleSubmit={mockHandleSubmit}
      />,
    );
    expect(
      screen.getByPlaceholderText(/Nhập email của bạn/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Gửi email xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(
      <ForgotPasswordForm
        onSubmit={mockOnSubmit}
        errors={{}}
        register={mockRegister}
        isLoading={false}
        isLoadingBack={false}
        router={mockRouter}
        setIsLoadingBack={mockSetIsLoadingBack}
        handleSubmit={mockHandleSubmit}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Gửi email xác nhận/i }),
    );
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("shows error message if email is invalid", () => {
    render(
      <ForgotPasswordForm
        onSubmit={mockOnSubmit}
        errors={{ email: { message: "Email không hợp lệ" } }}
        register={mockRegister}
        isLoading={false}
        isLoadingBack={false}
        router={mockRouter}
        setIsLoadingBack={mockSetIsLoadingBack}
        handleSubmit={mockHandleSubmit}
      />,
    );
    expect(screen.getByText(/Email không hợp lệ/i)).toBeInTheDocument();
  });
});
