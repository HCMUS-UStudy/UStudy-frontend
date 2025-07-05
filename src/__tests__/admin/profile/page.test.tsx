import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfilePage from "@/app/(admin)/admin/profile/page";

jest.mock("@/app/lib/services/user", () => ({
  getProfle: jest
    .fn()
    .mockResolvedValue({ data: { name: "Admin", email: "admin@email.com" } }),
}));

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/profile/ProfileHeader", () => () => (
  <div data-testid="profile-header" />
));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/profile/ProfileInfoGrid", () => () => (
  <div data-testid="profile-info-grid" />
));
jest.mock(
  "@/app/ui/components/_common/profile/ProfileLoadingSkeleton",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="profile-loading" />,
);

describe("Admin ProfilePage", () => {
  it("hiển thị loading khi đang tải dữ liệu", () => {
    render(<ProfilePage />);
    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
  });

  it("hiển thị header và info grid khi đã có dữ liệu", async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByTestId("profile-header")).toBeInTheDocument();
      expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();
    });
  });
});
