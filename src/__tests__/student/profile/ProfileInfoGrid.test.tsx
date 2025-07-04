import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock(
  "@/app/ui/components/_common/profile/ProfileItem",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => (
    <div data-testid="profile-item">
      {props.label}:{props.value}
    </div>
  ),
);

const ProfileInfoGrid =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/_common/profile/ProfileInfoGrid").default;

describe("ProfileInfoGrid (student)", () => {
  it("renders all profile items with correct labels and values", () => {
    const user = {
      email: "student@example.com",
      phone: "0123456789",
      gender: "MALE",
      birthday: "2000-01-01",
      address: "Hanoi",
    };
    render(<ProfileInfoGrid user={user} />);
    expect(
      screen.getByText(/Địa chỉ email:student@example.com/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Số điện thoại:0123456789/)).toBeInTheDocument();
    expect(screen.getByText(/Giới tính:Nam/)).toBeInTheDocument();
    expect(screen.getByText(/Ngày sinh:01\/01\/2000/)).toBeInTheDocument();
    expect(screen.getByText(/Địa chỉ:Hanoi/)).toBeInTheDocument();
  });

  it("renders gender as 'Nữ' for FEMALE", () => {
    const user = { gender: "FEMALE" };
    render(<ProfileInfoGrid user={user} />);
    expect(screen.getByText(/Giới tính:Nữ/)).toBeInTheDocument();
  });

  it("renders empty gender for unknown", () => {
    const user = { gender: "OTHER" };
    render(<ProfileInfoGrid user={user} />);
    expect(screen.getByText(/Giới tính:/)).toBeInTheDocument();
  });

  it("renders 'Invalid Date' for invalid birthday", () => {
    const user = { birthday: "not-a-date" };
    render(<ProfileInfoGrid user={user} />);
    expect(screen.getByText(/Ngày sinh:Invalid Date/)).toBeInTheDocument();
  });
});
