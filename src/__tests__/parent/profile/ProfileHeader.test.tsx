import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";
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

describe("ProfileHeader", () => {
  it("hiển thị avatar, tên và mã số", () => {
    render(<ProfileHeader user={mockUser} />);
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("Mã số: HS001")).toBeInTheDocument();
    // Avatar là thẻ img (next/image mock)
    expect(screen.getByAltText("User Avatar")).toBeInTheDocument();
  });

  it("mở modal cập nhật khi click nút cập nhật", () => {
    render(<ProfileHeader user={mockUser} />);
    const updateBtn = screen.getByRole("button", { name: /cập nhật/i });
    fireEvent.click(updateBtn);
    // Modal EditProfileModal xuất hiện (theo heading)
    expect(screen.getByText(/Chỉnh sửa thông tin/i)).toBeInTheDocument();
  });

  it("mở modal avatar khi click avatar", () => {
    render(<ProfileHeader user={mockUser} />);
    const avatar = screen.getByAltText("User Avatar");
    fireEvent.click(avatar);
    // Modal EditAvatarModal xuất hiện (theo heading)
    expect(screen.getByText(/Thay đổi ảnh đại diện/i)).toBeInTheDocument();
  });
});
