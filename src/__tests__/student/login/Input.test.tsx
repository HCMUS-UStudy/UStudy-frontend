import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/app/ui/components/_common/text-field/Input";

describe("Input Component", () => {
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
      target: { value: "abc" },
    });
    expect(handleChange).toHaveBeenCalled();
  });
});
