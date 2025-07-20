import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/app/ui/components/_common/text-field/Input";

describe("Teacher Login Input Component", () => {
  it("renders input with placeholder", () => {
    render(<Input placeholder="Tên tài khoản" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Tên tài khoản")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(
      <Input placeholder="Tên tài khoản" value="" onChange={handleChange} />,
    );
    fireEvent.change(screen.getByPlaceholderText("Tên tài khoản"), {
      target: { value: "teacher" },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders input with label", () => {
    render(
      <Input
        placeholder="Tên tài khoản"
        label="Tên tài khoản"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Tên tài khoản")).toBeInTheDocument();
  });

  it("renders input with error message", () => {
    render(
      <Input
        placeholder="Tên tài khoản"
        value=""
        onChange={() => {}}
        isError={true}
        errorMsg="Vui lòng nhập tên tài khoản"
      />,
    );
    expect(screen.getByText("Vui lòng nhập tên tài khoản")).toBeInTheDocument();
  });

  it("renders password input with type password", () => {
    render(
      <Input
        type="password"
        placeholder="Mật khẩu"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText("Mật khẩu")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
