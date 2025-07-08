import React from "react";
import { render } from "@testing-library/react";
import ProfileInfoGrid from "@/app/ui/components/_common/profile/ProfileInfoGrid";

describe("ProfileInfoGrid", () => {
  const mockUser = {
    id: "1",
    genId: "U001",
    name: "Admin",
    email: "admin@email.com",
    avatar: "avatar.png",
    phone: "0123456789",
    address: "Hanoi",
    gender: "MALE" as const,
    birthday: "2000-01-01",
  };
  it("render không lỗi với user null", () => {
    render(<ProfileInfoGrid user={null} />);
  });
  it("render không lỗi với user có dữ liệu", () => {
    render(<ProfileInfoGrid user={mockUser} />);
  });
});
