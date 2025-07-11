import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";
import "@testing-library/jest-dom";
import { GenderType } from "@/app/types/common";

const mockUser = {
  id: "1",
  genId: "HS001",
  name: "Nguyen Van A",
  email: "a@gmail.com",
  avatar: "/avatar.png",
  phone: "0123456789",
  address: "Hanoi",
  gender: "MALE" as GenderType,
  birthday: "2000-01-01",
};

describe("ProfileInfoGrid", () => {
  it("hiển thị đầy đủ thông tin cá nhân", () => {
    render(<ProfileInfoGrid user={mockUser} />);
    expect(screen.getByText("Địa chỉ email")).toBeInTheDocument();
    expect(screen.getByText("a@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Số điện thoại")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("Giới tính")).toBeInTheDocument();
    expect(screen.getByText("Nam")).toBeInTheDocument();
    expect(screen.getByText("Ngày sinh")).toBeInTheDocument();
    expect(screen.getByText("01/01/2000")).toBeInTheDocument();
    expect(screen.getByText("Địa chỉ")).toBeInTheDocument();
    expect(screen.getByText("Hanoi")).toBeInTheDocument();
  });

  it("hiển thị N/A nếu thiếu thông tin", () => {
    render(<ProfileInfoGrid user={null} />);
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
  });
});
