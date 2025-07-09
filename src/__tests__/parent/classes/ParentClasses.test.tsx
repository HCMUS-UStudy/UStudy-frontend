/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ParentClasses from "@/app/ui/components/user/parent/classes/ParentClasses";

// Mock the child components
jest.mock("@/app/ui/components/user/parent/classes/CurrentClass", () => {
  return function MockCurrentClass() {
    return <div data-testid="current-class">Current Class Component</div>;
  };
});

jest.mock("@/app/ui/components/user/parent/classes/CompletedClass", () => {
  return function MockCompletedClass() {
    return <div data-testid="completed-class">Completed Class Component</div>;
  };
});

// Mock the Tabs component
jest.mock("@/app/ui/components/_common/Tabs", () => ({
  Tabs: ({ children, className }: any) => (
    <div data-testid="tabs" className={className}>
      {children}
    </div>
  ),
  TabList: ({ children, className }: any) => (
    <div data-testid="tab-list" className={className}>
      {children}
    </div>
  ),
  Tab: ({ label, value, onClick }: any) => (
    <button
      data-testid={`tab-${value}`}
      onClick={() => onClick?.(value)}
      className="tab-button"
    >
      {label}
    </button>
  ),
  TabPanel: ({ children, value }: any) => (
    <div data-testid={`tab-panel-${value}`}>{children}</div>
  ),
}));

describe("ParentClasses Component", () => {
  it("renders the component with tabs", () => {
    render(<ParentClasses />);

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
    expect(screen.getByTestId("tab-list")).toBeInTheDocument();
  });

  it("renders both tab buttons with correct labels", () => {
    render(<ParentClasses />);

    expect(screen.getByTestId("tab-current")).toBeInTheDocument();
    expect(screen.getByTestId("tab-completed")).toBeInTheDocument();
    expect(screen.getByText("Lớp học hiện tại")).toBeInTheDocument();
    expect(screen.getByText("Lớp học đã hoàn thành")).toBeInTheDocument();
  });

  it("renders tab panels", () => {
    render(<ParentClasses />);

    expect(screen.getByTestId("tab-panel-current")).toBeInTheDocument();
    expect(screen.getByTestId("tab-panel-completed")).toBeInTheDocument();
  });

  it("renders CurrentClass component in current tab panel", () => {
    render(<ParentClasses />);

    expect(screen.getByTestId("current-class")).toBeInTheDocument();
  });

  it("renders CompletedClass component in completed tab panel", () => {
    render(<ParentClasses />);

    expect(screen.getByTestId("completed-class")).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<ParentClasses />);

    const container = screen.getByTestId("tabs").parentElement;
    expect(container).toHaveClass("px-2");

    const tabs = screen.getByTestId("tabs");
    expect(tabs).toHaveClass("mb-6");

    const tabList = screen.getByTestId("tab-list");
    expect(tabList).toHaveClass("mb-4");
  });

  it("handles tab switching", () => {
    render(<ParentClasses />);

    const currentTab = screen.getByTestId("tab-current");
    const completedTab = screen.getByTestId("tab-completed");

    expect(currentTab).toBeInTheDocument();
    expect(completedTab).toBeInTheDocument();

    // Test tab click (though the actual switching logic is handled by the Tabs component)
    fireEvent.click(completedTab);
    fireEvent.click(currentTab);
  });
});
