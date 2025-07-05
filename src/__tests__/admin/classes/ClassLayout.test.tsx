/* eslint-disable @next/next/no-html-link-for-pages */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassLayout from "@/app/(admin)/admin/classes/[classId]/layout";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock the AdminNavigation component
jest.mock("@/app/ui/components/admin/classes/ClassAdminNavigation", () => {
  return function MockAdminNavigation({ activeTab }: { activeTab: string }) {
    return (
      <nav data-testid="admin-navigation">
        <span data-testid="active-tab">{activeTab}</span>
        <a href="/admin/classes/123/overview">Overview</a>
        <a href="/admin/classes/123/members">Members</a>
        <a href="/admin/classes/123/material">Material</a>
        <a href="/admin/classes/123/assignment">Assignment</a>
        <a href="/admin/classes/123/attendance">Attendance</a>
        <a href="/admin/classes/123/notifications">Notifications</a>
        <a href="/admin/classes/123/setting">Setting</a>
      </nav>
    );
  };
});

describe("Class Layout", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUsePathname = require("next/navigation").usePathname;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navigation and children", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/overview");

    render(
      <ClassLayout>
        <div data-testid="child-content">Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("admin-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("detects overview as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/overview");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("overview");
  });

  it("detects members as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/members");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("members");
  });

  it("detects material as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/material");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("material");
  });

  it("detects assignment as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/assignment");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("assignment");
  });

  it("detects attendance as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/attendance");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("attendance");
  });

  it("detects notifications as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/notifications");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("notifications");
  });

  it("detects setting as active tab", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/setting");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("setting");
  });

  it("handles empty pathname gracefully", () => {
    mockUsePathname.mockReturnValue("");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("");
  });

  it("handles pathname with insufficient segments", () => {
    mockUsePathname.mockReturnValue("/admin/classes");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("");
  });

  it("handles pathname with extra segments", () => {
    mockUsePathname.mockReturnValue(
      "/admin/classes/123/members/extra/segments",
    );

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByTestId("active-tab")).toHaveTextContent("members");
  });

  it("renders navigation links correctly", () => {
    mockUsePathname.mockReturnValue("/admin/classes/123/overview");

    render(
      <ClassLayout>
        <div>Child Content</div>
      </ClassLayout>,
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Material")).toBeInTheDocument();
    expect(screen.getByText("Assignment")).toBeInTheDocument();
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Setting")).toBeInTheDocument();
  });
});
