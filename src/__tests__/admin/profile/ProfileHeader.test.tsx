import React from "react";
import { render } from "@testing-library/react";
import ProfileHeader from "@/app/ui/components/_common/profile/ProfileHeader";

// Mock next/image để tránh lỗi khi test
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
jest.mock("next/image", () => (props: any) => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  return <img {...props} />;
});

describe("ProfileHeader", () => {
  const mockUser = {
    id: "1",
    genId: "U001",
    name: "Admin",
    email: "admin@email.com",
    avatar: "/avatar.png",
    phone: "0123456789",
    address: "Hanoi",
    gender: "MALE" as const,
    birthday: "2000-01-01",
  };
  it("render không lỗi với user null", () => {
    render(<ProfileHeader user={null} onSuccess={jest.fn()} />);
  });
  it("render không lỗi với user có dữ liệu", () => {
    render(<ProfileHeader user={mockUser} onSuccess={jest.fn()} />);
  });
});
