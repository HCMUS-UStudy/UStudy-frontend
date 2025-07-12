import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ParentAcademicResultsView from "@/app/ui/components/user/parent/academic-results/ParentAcademicResultsView";
import * as store from "@/app/store/store";
import * as childClasses from "@/app/lib/services/childClasses";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/app/store/store");
jest.mock("@/app/lib/services/childClasses");

describe("ParentAcademicResultsView", () => {
  const mockChild = { id: "child1", name: "Child 1" };
  const mockClasses = {
    content: [
      {
        id: "class1",
        name: "Lớp 1",
        course: { name: "Toán" },
        grade: { name: "Khối 1" },
        startDate: "2023-08-01",
        endDate: "2024-05-31",
      },
    ],
    totalPages: 1,
  };
  const mockScores = [
    {
      subject: "Toán",
      score: 9,
      course: { name: "Toán" },
      skills: [], // add more fields if needed by SkillChart
      // add other properties if required by the chart components
    },
  ];
  const mockDetails = {
    id: "class1",
    name: "Lớp 1",
    course: { name: "Toán" },
    grade: { name: "Khối 1" },
    startDate: "2023-08-01",
    endDate: "2024-05-31",
    studentAverage: 8.5,
    classAverage: 7.9,
    // add other fields if required by the details table or header
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    (store.useAppSelector as unknown as jest.Mock).mockReturnValue(mockChild);
    (childClasses.getListChildClasses as jest.Mock).mockResolvedValue(
      mockClasses,
    );
    (childClasses.getChildScores as jest.Mock).mockResolvedValue(mockScores);
    (childClasses.getChildClassDetails as jest.Mock).mockResolvedValue(
      mockDetails,
    );
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("renders loading skeleton when loading classes", () => {
    (childClasses.getListChildClasses as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );
    render(
      <QueryClientProvider client={queryClient}>
        <ParentAcademicResultsView />
      </QueryClientProvider>,
    );
    // Kiểm tra có skeleton loading (class animate-pulse)
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("renders error message if error", async () => {
    (childClasses.getListChildClasses as jest.Mock).mockRejectedValue(
      new Error("Error!"),
    );
    render(
      <QueryClientProvider client={queryClient}>
        <ParentAcademicResultsView />
      </QueryClientProvider>,
    );
    // Kiểm tra fallback/skeleton khi lỗi (class animate-pulse)
    await waitFor(() => {
      expect(
        document.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });
  });

  it("renders message if no child selected", () => {
    (store.useAppSelector as unknown as jest.Mock).mockReturnValue(undefined);
    render(
      <QueryClientProvider client={queryClient}>
        <ParentAcademicResultsView />
      </QueryClientProvider>,
    );
    expect(screen.getByText(/vui lòng chọn con/i)).toBeInTheDocument();
  });

  it("renders charts and details tab", async () => {
    // Ensure mocks are properly set up for this test
    (childClasses.getListChildClasses as jest.Mock).mockResolvedValue(
      mockClasses,
    );
    (childClasses.getChildScores as jest.Mock).mockResolvedValue(mockScores);
    (childClasses.getChildClassDetails as jest.Mock).mockResolvedValue(
      mockDetails,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ParentAcademicResultsView />
      </QueryClientProvider>,
    );

    // Wait for the select to be rendered
    await waitFor(() => {
      expect(screen.getByLabelText("Lớp học")).toBeInTheDocument();
    });

    // Chọn lớp cụ thể (không phải 'all')
    fireEvent.change(screen.getByLabelText("Lớp học"), {
      target: { value: "class1" },
    });

    // Wait for the tab to be rendered
    await waitFor(() => {
      expect(screen.getByText("Chi tiết")).toBeInTheDocument();
    });

    // Chuyển sang tab 'Chi tiết'
    const detailsTab = screen.getByText("Chi tiết");
    fireEvent.click(detailsTab);

    // Kiểm tra label đặc trưng của bảng chi tiết
    await waitFor(() => {
      expect(screen.getByText(/chi tiết lớp học/i)).toBeInTheDocument();
    });
  });
});
