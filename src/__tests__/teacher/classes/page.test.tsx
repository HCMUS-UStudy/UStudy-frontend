/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Classes from "@/app/(user)/teacher/classes/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the services
jest.mock("@/app/lib/services/class", () => ({
  getClassesForTeacher: jest.fn(() =>
    Promise.resolve([
      {
        id: "1",
        name: "Lớp 10A",
        description: "Lớp học toán cơ bản",
        status: "PROGRESS",
        course: { id: "1", name: "Toán" },
        grade: { id: "1", name: "Lớp 10" },
        studentAmount: 25,
        classSessions: [],
      },
      {
        id: "2",
        name: "Lớp 10B",
        description: "Lớp học văn học",
        status: "COMPLETED",
        course: { id: "2", name: "Văn" },
        grade: { id: "1", name: "Lớp 10" },
        studentAmount: 30,
        classSessions: [],
      },
    ]),
  ),
}));

// Mock the components
jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  return function MockSearchField({ placeholder }: { placeholder: string }) {
    return <input data-testid="search-field" placeholder={placeholder} />;
  };
});

jest.mock("@/app/ui/components/user/teacher/ClassList", () => {
  return function MockClassList({ classes, completed }: any) {
    return (
      <div data-testid="class-list" data-completed={completed}>
        {classes.map((cls: any) => (
          <div key={cls.id} data-testid={`class-item-${cls.id}`}>
            {cls.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Tabs", () => ({
  Tab: ({ children, value, label }: any) => (
    <div data-testid={`tab-${value}`} data-label={label}>
      {children}
    </div>
  ),
  TabList: ({ children }: any) => <div data-testid="tab-list">{children}</div>,
  TabPanel: ({ children, value }: any) => (
    <div data-testid={`tab-panel-${value}`}>{children}</div>
  ),
  Tabs: ({ children, value }: any) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("Teacher Classes Page", () => {
  it("renders loading state initially", () => {
    renderWithQueryClient(<Classes />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders tabs with correct labels", async () => {
    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-list")).toBeInTheDocument();
      expect(screen.getByTestId("tab-ongoing")).toBeInTheDocument();
      expect(screen.getByTestId("tab-completed")).toBeInTheDocument();
      expect(screen.getByTestId("tab-ongoing")).toHaveAttribute(
        "data-label",
        "Lớp đang dạy",
      );
      expect(screen.getByTestId("tab-completed")).toHaveAttribute(
        "data-label",
        "Lớp đã hoàn thành",
      );
    });
  });

  it("renders search field", async () => {
    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(screen.getByTestId("search-field")).toBeInTheDocument();
      expect(screen.getByTestId("search-field")).toHaveAttribute(
        "placeholder",
        "Tìm kiếm lớp học...",
      );
    });
  });

  it("renders ongoing classes in ongoing tab", async () => {
    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-panel-ongoing")).toBeInTheDocument();
      const classLists = screen.getAllByTestId("class-list");
      const ongoingClassList = classLists.find(
        (list) => list.getAttribute("data-completed") === "false",
      );
      expect(ongoingClassList).toBeInTheDocument();
      expect(screen.getByTestId("class-item-1")).toBeInTheDocument();
      expect(screen.getByText("Lớp 10A")).toBeInTheDocument();
    });
  });

  it("renders completed classes in completed tab", async () => {
    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-panel-completed")).toBeInTheDocument();
      const classLists = screen.getAllByTestId("class-list");
      const completedClassList = classLists.find(
        (list) => list.getAttribute("data-completed") === "true",
      );
      expect(completedClassList).toBeInTheDocument();
      expect(screen.getByTestId("class-item-2")).toBeInTheDocument();
      expect(screen.getByText("Lớp 10B")).toBeInTheDocument();
    });
  });

  it("filters classes by status correctly", async () => {
    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      // Ongoing classes should only show PROGRESS status
      const classLists = screen.getAllByTestId("class-list");
      const ongoingClassList = classLists.find(
        (list) => list.getAttribute("data-completed") === "false",
      );
      const completedClassList = classLists.find(
        (list) => list.getAttribute("data-completed") === "true",
      );

      expect(ongoingClassList).toBeInTheDocument();
      expect(completedClassList).toBeInTheDocument();
    });
  });

  it("handles empty class lists", async () => {
    const mockGetClassesForTeacher =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/class").getClassesForTeacher;
    mockGetClassesForTeacher.mockResolvedValueOnce([]);

    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-panel-ongoing")).toBeInTheDocument();
      expect(screen.getByTestId("tab-panel-completed")).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    const mockGetClassesForTeacher =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/class").getClassesForTeacher;
    mockGetClassesForTeacher.mockRejectedValueOnce(new Error("API Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithQueryClient(<Classes />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching classes:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
