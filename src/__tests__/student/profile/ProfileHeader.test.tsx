import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child modals and hooks
jest.mock(
  "@/app/ui/components/_common/profile/EditProfileModal",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) =>
    props.isOpen ? <div data-testid="edit-profile-modal" /> : null,
);
jest.mock(
  "@/app/ui/components/_common/profile/EditAvatarModal",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) =>
    props.isOpen ? <div data-testid="edit-avatar-modal" /> : null,
);
jest.mock("@/app/lib/services/user", () => ({
  updateProfile: jest.fn(),
  updateAvatar: jest.fn(),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({ addToast: { success: jest.fn() } }),
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
jest.mock("next/image", () => (props: any) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img data-testid="avatar" src={props.src} alt={props.alt} />
));

const ProfileHeader =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/_common/profile/ProfileHeader").default;

const mockUser = { name: "Student", genId: "S123", avatar: "/avatar.png" };

describe("ProfileHeader (student)", () => {
  it("renders user name, genId, avatar, and update button", () => {
    render(<ProfileHeader user={mockUser} />);
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText(/mã số/i)).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toHaveAttribute("src", "/avatar.png");
    expect(screen.getByText(/cập nhật/i)).toBeInTheDocument();
  });

  it("opens EditProfileModal when update button is clicked", async () => {
    render(<ProfileHeader user={mockUser} />);
    fireEvent.click(screen.getByText(/cập nhật/i));
    expect(screen.getByTestId("edit-profile-modal")).toBeInTheDocument();
  });

  it("opens EditAvatarModal when avatar is clicked", async () => {
    render(<ProfileHeader user={mockUser} />);
    fireEvent.click(screen.getByTestId("avatar"));
    expect(screen.getByTestId("edit-avatar-modal")).toBeInTheDocument();
  });
});
