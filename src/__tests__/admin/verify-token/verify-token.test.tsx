import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminVerifyToken from "@/app/(admin)/admin/verify-token/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: () => "test@example.com" }),
}));
jest.mock("@/app/lib/services/auth", () => ({
  verifyOtp: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ mutate: jest.fn() }),
}));

describe("Admin VerifyToken Page", () => {
  it("renders the verify token form", () => {
    render(<AdminVerifyToken />);
    expect(screen.getByText(/Xác thực mã OTP/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Xác nhận/i }),
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty code", async () => {
    render(<AdminVerifyToken />);
    fireEvent.click(screen.getByRole("button", { name: /Xác nhận/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Vui lòng nhập đủ 6 số xác thực/i),
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid code", async () => {
    render(<AdminVerifyToken />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, idx) => {
      fireEvent.change(input, { target: { value: String(idx + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /Xác nhận/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/Vui lòng nhập đủ 6 số xác thực/i),
      ).not.toBeInTheDocument();
    });
  });
});
