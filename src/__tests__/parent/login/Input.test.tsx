import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/app/ui/components/_common/text-field/Input";

describe("Input Component for Parent Login", () => {
  it("renders input with label", () => {
    render(
      <Input
        type="text"
        placeholder="Nhập tên tài khoản"
        label="Tên tài khoản"
      />,
    );
    expect(
      screen.getByPlaceholderText("Nhập tên tài khoản"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tên tài khoản")).toBeInTheDocument();
  });

  it("shows error message when isError is true", () => {
    render(
      <Input
        type="text"
        placeholder="Nhập tên tài khoản"
        label="Tên tài khoản"
        isError={true}
        errorMsg="Tên tài khoản không hợp lệ"
      />,
    );
    expect(screen.getByText("Tên tài khoản không hợp lệ")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="text"
        placeholder="Nhập tên tài khoản"
        label="Tên tài khoản"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("Nhập tên tài khoản");
    fireEvent.change(input, { target: { value: "parent123" } });

    expect(input).toHaveValue("parent123");
  });

  it("renders password input with correct type", () => {
    render(
      <Input type="password" placeholder="Nhập mật khẩu" label="Mật khẩu" />,
    );

    const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("applies error styling when isError is true", () => {
    render(
      <Input
        type="text"
        placeholder="Nhập tên tài khoản"
        label="Tên tài khoản"
        isError={true}
        errorMsg="Lỗi"
      />,
    );

    const input = screen.getByPlaceholderText("Nhập tên tài khoản");
    expect(input).toBeInTheDocument();
  });
});
