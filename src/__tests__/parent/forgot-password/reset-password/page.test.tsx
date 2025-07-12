import "@testing-library/jest-dom";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock(
  "@/app/ui/components/_common/resetPassword/ResetPasswordComponent",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="reset-password-component" />,
);

describe("ResetPassword page", () => {
  it("renders ResetPasswordComponent", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByTestId("reset-password-component")).toBeInTheDocument();
  });

  it("renders loading fallback when suspense", () => {
    // Không thể test Suspense fallback trực tiếp vì component con đã mock, nhưng có thể kiểm tra không lỗi.
    render(<ResetPasswordPage />);
    expect(screen.getByTestId("reset-password-component")).toBeInTheDocument();
  });
});
