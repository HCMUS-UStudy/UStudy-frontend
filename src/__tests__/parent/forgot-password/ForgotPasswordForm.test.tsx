import "@testing-library/jest-dom";
import ForgotPasswordForm from "@/app/ui/components/_common/forgetPassword/ForgotPasswordForm";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
});

describe("ForgotPasswordForm", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      onSubmit: jest.fn(),
      errors: {},
      register: jest.fn(() => ({ name: "email", onChange: jest.fn() })),
      isLoading: false,
      isLoadingBack: false,
      router: { push: jest.fn() },
      setIsLoadingBack: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        fn({ email: "test@email.com" });
      },
    };
    return render(<ForgotPasswordForm {...defaultProps} {...props} />);
  };

  it("renders input and button", () => {
    setup();
    expect(screen.getByPlaceholderText(/nhập email/i)).toBeInTheDocument();
    expect(screen.getByText(/gửi email xác nhận/i)).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = jest.fn();
    setup({ onSubmit });
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.click(screen.getByText(/gửi email xác nhận/i));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows error message if email invalid", () => {
    setup({ errors: { email: { message: "Email không hợp lệ" } } });
    expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading", () => {
    setup({ isLoading: true });
    expect(
      screen.getByRole("button", { name: /gửi email xác nhận/i }),
    ).toBeDisabled();
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
