import "@testing-library/jest-dom";
import ResetPasswordForm from "@/app/ui/components/_common/resetPassword/ResetPasswordForm";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
});

describe("ResetPasswordForm", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      onSubmit: jest.fn(),
      errors: {},
      register: jest.fn((name: string) => ({ name, onChange: jest.fn() })),
      isLoading: false,
      isLoadingBack: false,
      router: { push: jest.fn() },
      setIsLoadingBack: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        fn({ password: "123456", confirmPassword: "123456" });
      },
    };
    return render(<ResetPasswordForm {...defaultProps} {...props} />);
  };

  it("renders password and confirm inputs", () => {
    setup();
    expect(
      screen.getByPlaceholderText(/nhập mật khẩu mới/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/nhập lại mật khẩu mới/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = jest.fn();
    setup({ onSubmit });
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu mới/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/nhập lại mật khẩu mới/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /xác nhận/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows error message if password invalid", () => {
    setup({ errors: { password: { message: "Mật khẩu không hợp lệ" } } });
    expect(screen.getByText(/mật khẩu không hợp lệ/i)).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading", () => {
    setup({ isLoading: true });
    expect(screen.getByRole("button", { name: /xác nhận/i })).toBeDisabled();
  });

  it("back button triggers router.push", () => {
    const router = { push: jest.fn() };
    const setIsLoadingBack = jest.fn();
    setup({ router, setIsLoadingBack });
    fireEvent.click(screen.getByText(/quay lại đăng nhập/i));
    expect(setIsLoadingBack).toHaveBeenCalledWith(true);
    expect(router.push).toHaveBeenCalled();
  });
});
