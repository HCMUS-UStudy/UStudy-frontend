import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileItem from "@/app/ui/components/_common/profile/ProfileItem";
import { FiMail } from "react-icons/fi";
import "@testing-library/jest-dom";

describe("ProfileItem", () => {
  it("hiển thị label, value và icon", () => {
    render(
      <ProfileItem
        icon={<FiMail data-testid="icon" />}
        label="Email"
        value="test@gmail.com"
      />,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("test@gmail.com")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("hiển thị N/A nếu không có value", () => {
    render(<ProfileItem icon={<FiMail />} label="Email" />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
