import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoleDisplay from "@/app/ui/components/admin/roles/RoleDisplay";

jest.mock("@/app/lib/services/role", () => ({
  getAllRolesByDefault: jest.fn(),
}));

const mockGetAllRolesByDefault =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/lib/services/role").getAllRolesByDefault;

describe("RoleDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    render(<RoleDisplay />);
    expect(screen.getByText(/Đang tải dữ liệu/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    mockGetAllRolesByDefault.mockImplementation(() => {
      throw new Error("error");
    });
    render(<RoleDisplay />);
    await waitFor(() => {
      expect(
        screen.getByText(/Lỗi khi lấy dữ liệu vai trò/i),
      ).toBeInTheDocument();
    });
  });

  it("renders roles data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetAllRolesByDefault.mockImplementation((role: any) =>
      Promise.resolve([
        { id: `${role}-1`, name: `${role} Role 1` },
        { id: `${role}-2`, name: `${role} Role 2` },
      ]),
    );
    render(<RoleDisplay />);
    await waitFor(() => {
      expect(screen.getByText("ADMIN")).toBeInTheDocument();
      expect(screen.getByText("ADMIN Role 1")).toBeInTheDocument();
      expect(screen.getByText("ADMIN Role 2")).toBeInTheDocument();
      expect(screen.getByText("TEACHER")).toBeInTheDocument();
      expect(screen.getByText("TEACHER Role 1")).toBeInTheDocument();
      expect(screen.getByText("TEACHER Role 2")).toBeInTheDocument();
      expect(screen.getByText("STUDENT")).toBeInTheDocument();
      expect(screen.getByText("STUDENT Role 1")).toBeInTheDocument();
      expect(screen.getByText("STUDENT Role 2")).toBeInTheDocument();
      expect(screen.getByText("PARENT")).toBeInTheDocument();
      expect(screen.getByText("PARENT Role 1")).toBeInTheDocument();
      expect(screen.getByText("PARENT Role 2")).toBeInTheDocument();
    });
  });
});
