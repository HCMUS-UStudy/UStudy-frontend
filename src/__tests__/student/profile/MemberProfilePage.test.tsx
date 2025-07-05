import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock hooks and services
jest.mock("@/app/lib/services/user", () => ({ getProfle: jest.fn() }));
jest.mock("@/app/lib/action", () => ({ getUserDataFromCookies: jest.fn() }));
jest.mock("react-redux", () => ({ useSelector: jest.fn() }));

// Mock child components
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

const MemberProfilePage =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/(user)/member/profile/page.tsx").default;

const mockUser = { id: "u1", name: "Student", email: "student@example.com" };

describe("MemberProfilePage (STUDENT)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/app/lib/services/user").getProfle.mockResolvedValue({
      data: mockUser,
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/app/lib/action").getUserDataFromCookies.mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react-redux").useSelector.mockReturnValue({ children: [] });
  });

  it("renders loading state initially", async () => {
    render(<MemberProfilePage />);
    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument(),
    );
  });

  it("renders student profile after loading", async () => {
    render(<MemberProfilePage />);
    await waitFor(() =>
      expect(screen.getByTestId("profile-header")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();
  });
});
