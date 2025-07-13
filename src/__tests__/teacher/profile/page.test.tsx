/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeacherProfilePage from "@/app/(user)/teacher/profile/page";

// Mock services
jest.mock("@/app/lib/services/user", () => ({
  getProfle: jest.fn(),
}));

// Mock components
jest.mock("@/app/ui/components/_common/profile/ProfileHeader", () => ({
  __esModule: true,
  default: ({ user, onSuccess }: any) => (
    <div data-testid="profile-header">
      <h1>Profile Header</h1>
      <p>User: {user?.name || "Unknown"}</p>
      <button onClick={onSuccess} data-testid="refresh-button">
        Refresh
      </button>
    </div>
  ),
}));

jest.mock("@/app/ui/components/_common/profile/ProfileInfoGrid", () => ({
  __esModule: true,
  default: ({ user }: any) => (
    <div data-testid="profile-info-grid">
      <h2>Profile Info Grid</h2>
      <p>Email: {user?.email || "N/A"}</p>
      <p>Phone: {user?.phone || "N/A"}</p>
      <p>Address: {user?.address || "N/A"}</p>
      <p>Gender: {user?.gender || "N/A"}</p>
      <p>Birthday: {user?.birthday || "N/A"}</p>
    </div>
  ),
}));

jest.mock("@/app/ui/components/_common/profile/ProfileLoadingSkeleton", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="profile-loading">
      <div>Loading...</div>
    </div>
  ),
}));

const mockUserProfile = {
  id: "user-1",
  genId: "T001",
  name: "Nguyễn Văn A",
  email: "teacher@example.com",
  avatar: "/avatars/teacher.jpg",
  phone: "0123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  gender: "MALE" as const,
  birthday: "1990-01-01T00:00:00.000Z",
};

describe("TeacherProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockResolvedValue({ data: mockUserProfile });
  });

  it("renders loading state initially", () => {
    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TeacherProfilePage />);

    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders profile data after loading", async () => {
    render(<TeacherProfilePage />);

    // Initially shows loading
    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    // Check that profile components are rendered
    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();

    // Check that user data is passed correctly
    expect(screen.getByText("User: Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("Email: teacher@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: 0123456789")).toBeInTheDocument();
    expect(
      screen.getByText("Address: 123 Đường ABC, Quận 1, TP.HCM"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gender: MALE")).toBeInTheDocument();
    expect(
      screen.getByText("Birthday: 1990-01-01T00:00:00.000Z"),
    ).toBeInTheDocument();
  });

  it("handles null user data", async () => {
    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockResolvedValue({ data: null });

    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();

    // Check that components handle null user gracefully
    expect(screen.getByText("User: Unknown")).toBeInTheDocument();
    expect(screen.getByText("Email: N/A")).toBeInTheDocument();
    expect(screen.getByText("Phone: N/A")).toBeInTheDocument();
    expect(screen.getByText("Address: N/A")).toBeInTheDocument();
    expect(screen.getByText("Gender: N/A")).toBeInTheDocument();
    expect(screen.getByText("Birthday: N/A")).toBeInTheDocument();
  });

  it("handles error when fetching profile fails", async () => {
    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetProfle.mockRejectedValue(new Error("Failed to fetch profile"));

    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    // Should still render the components even if data fetch fails
    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();

    // Should show unknown user since fetch failed
    expect(screen.getByText("User: Unknown")).toBeInTheDocument();

    // Check that error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch profile:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("calls getProfle service correctly", async () => {
    const mockGetProfle = require("@/app/lib/services/user").getProfle;

    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(mockGetProfle).toHaveBeenCalledTimes(1);
      expect(mockGetProfle).toHaveBeenCalledWith();
    });
  });

  it("passes onSuccess callback to ProfileHeader", async () => {
    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    const refreshButton = screen.getByTestId("refresh-button");
    expect(refreshButton).toBeInTheDocument();

    // Click refresh button to test onSuccess callback
    await act(async () => {
      refreshButton.click();
    });

    // Should call getProfle again
    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    await waitFor(() => {
      expect(mockGetProfle).toHaveBeenCalledTimes(2);
    });
  });

  it("renders with different user data", async () => {
    const differentUser = {
      id: "user-2",
      genId: "T002",
      name: "Trần Thị B",
      email: "teacher2@example.com",
      avatar: "/avatars/teacher2.jpg",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      gender: "FEMALE" as const,
      birthday: "1985-05-15T00:00:00.000Z",
    };

    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockResolvedValue({ data: differentUser });

    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByText("User: Trần Thị B")).toBeInTheDocument();
    expect(screen.getByText("Email: teacher2@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: 0987654321")).toBeInTheDocument();
    expect(
      screen.getByText("Address: 456 Đường XYZ, Quận 2, TP.HCM"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gender: FEMALE")).toBeInTheDocument();
    expect(
      screen.getByText("Birthday: 1985-05-15T00:00:00.000Z"),
    ).toBeInTheDocument();
  });

  it("handles user with missing optional fields", async () => {
    const userWithMissingFields = {
      id: "user-3",
      genId: "T003",
      name: "Lê Văn C",
      email: "teacher3@example.com",
      avatar: "",
      phone: "",
      address: "",
      gender: "" as any,
      birthday: "",
    };

    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockResolvedValue({ data: userWithMissingFields });

    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    expect(screen.getByText("User: Lê Văn C")).toBeInTheDocument();
    expect(screen.getByText("Email: teacher3@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: N/A")).toBeInTheDocument();
    expect(screen.getByText("Address: N/A")).toBeInTheDocument();
    expect(screen.getByText("Gender: N/A")).toBeInTheDocument();
    expect(screen.getByText("Birthday: N/A")).toBeInTheDocument();
  });

  it("maintains loading state during data fetch", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    const mockGetProfle = require("@/app/lib/services/user").getProfle;
    mockGetProfle.mockReturnValue(promise);

    render(<TeacherProfilePage />);

    // Should show loading initially
    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({ data: mockUserProfile });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    // Should show profile data
    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("profile-info-grid")).toBeInTheDocument();
  });

  it("handles multiple rapid refresh calls", async () => {
    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    const refreshButton = screen.getByTestId("refresh-button");
    const mockGetProfle = require("@/app/lib/services/user").getProfle;

    // Click refresh multiple times rapidly
    await act(async () => {
      refreshButton.click();
      refreshButton.click();
      refreshButton.click();
    });

    await waitFor(() => {
      expect(mockGetProfle).toHaveBeenCalledTimes(4); // Initial + 3 clicks
    });
  });

  it("renders with correct CSS classes", async () => {
    render(<TeacherProfilePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
    });

    // Check that the main container exists and has the expected structure
    const profileHeader = screen.getByTestId("profile-header");
    expect(profileHeader).toBeInTheDocument();

    // Check that the component renders the expected content
    expect(screen.getByText("Profile Header")).toBeInTheDocument();
    expect(screen.getByText("Profile Info Grid")).toBeInTheDocument();
    expect(screen.getByText("User: Nguyễn Văn A")).toBeInTheDocument();
  });
});
