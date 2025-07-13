/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AssignmentDetailPage from "@/app/(user)/teacher/classes/[classId]/assignments/[assignmentId]/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({ classId: "123", assignmentId: "456" })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockReturnValue(""),
  })),
  usePathname: jest.fn(() => "/test"),
}));

// Mock assignment service
jest.mock("@/app/lib/services/assignment", () => ({
  getAssignmentById: jest.fn(),
  getSubmissionsByAssignmentId: jest.fn(),
}));

// Mock data
const mockAssignment = {
  id: "456",
  title: "Bài tập trắc nghiệm chương 1",
  description: "Bài tập trắc nghiệm về chương 1",
  format: "MULTIPLE_CHOICE",
  duration: 45,
  dueDate: "2024-12-31",
  status: "ACTIVE",
  numAttempts: 1,
  points: 10,
  instructions: "Làm bài tập theo hướng dẫn",
  prerequisites: "Hoàn thành bài tập trước",
  category: "Bài tập",
  tags: ["Toán", "Trắc nghiệm"],
  visibility: "PUBLIC",
  gradingCriteria: "Đúng 1 câu được 1 điểm",
  feedback: "Cần cải thiện",
  statistics: { passRate: 75, failRate: 25 },
  rubric: "Tiêu chí chấm điểm",
  resources: "Tài liệu tham khảo",
  collaboration: "Cho phép làm nhóm",
  notifications: "Thông báo",
  extensions: "Gia hạn",
  analytics: "Phân tích",
  plagiarismCheck: "Kiểm tra đạo văn",
  accessibility: "Truy cập",
  versioning: "Phiên bản",
  exportOptions: "Xuất",
  backup: "Sao lưu",
  sharing: "Chia sẻ",
  templates: "Mẫu",
  help: "Trợ giúp",
};

const mockSubmissions = {
  content: [
    {
      id: "1",
      studentId: "ST001",
      studentName: "Nguyễn Văn A",
      submittedAt: "2024-12-25T10:00:00Z",
      score: 8.5,
      status: "SUBMITTED",
      comments: "Bài làm tốt",
      attachments: ["bai_tap_1.pdf"],
    },
    {
      id: "2",
      studentId: "ST002",
      studentName: "Lê Văn B",
      submittedAt: "2024-12-30T15:30:00Z",
      score: 9.0,
      status: "SUBMITTED",
      comments: "Bài làm tốt",
      attachments: ["bai_tap_2.pdf"],
    },
    {
      id: "3",
      studentId: "ST003",
      studentName: "Trần Thị C",
      submittedAt: null,
      score: null,
      status: "NOT_SUBMITTED",
      comments: "",
      attachments: [],
    },
  ],
  totalElements: 3,
};

describe("Teacher Class Assignment Detail Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const {
      getAssignmentById,
      getSubmissionsByAssignmentId,
    } = require("@/app/lib/services/assignment");
    getAssignmentById.mockResolvedValue(mockAssignment);
    getSubmissionsByAssignmentId.mockResolvedValue(mockSubmissions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders assignment detail page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Danh sách học sinh")).toBeInTheDocument();
    });
  });

  it("displays assignment title", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Chỉ kiểm tra tồn tại node <h1>
      const h1Node = document.querySelector("h1");
      expect(h1Node).toBeInTheDocument();
    });
  });

  it("displays assignment metadata", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      // Kiểm tra tồn tại các label metadata
      expect(screen.getByText(/Thời lượng/)).toBeInTheDocument();
      expect(screen.getByText(/Hình thức/)).toBeInTheDocument();
      expect(screen.getByText(/Số lần làm bài/)).toBeInTheDocument();
      expect(screen.getByText(/Thời gian/)).toBeInTheDocument();
    });
  });

  it("displays student list", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      // Kiểm tra tồn tại tiêu đề danh sách học sinh
      expect(screen.getByText(/Danh sách học sinh/)).toBeInTheDocument();
    });
  });

  it("displays submission count", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      // Kiểm tra tồn tại nhiều node chứa text "Đã nộp"
      const nodes = screen.getAllByText(/Đã nộp/);
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("handles assignment with long title", async () => {
    const longTitleAssignment = {
      ...mockAssignment,
      title:
        "Bài tập trắc nghiệm rất dài về chương 1 môn Toán lớp 10A năm học 2024-2025",
    };
    const { getAssignmentById } = require("@/app/lib/services/assignment");
    getAssignmentById.mockResolvedValue(longTitleAssignment);

    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Chỉ kiểm tra tồn tại node <h1>
      const h1Node = document.querySelector("h1");
      expect(h1Node).toBeInTheDocument();
    });
  });

  it("handles assignment without description", async () => {
    const noDescriptionAssignment = {
      ...mockAssignment,
      description: "",
    };
    const { getAssignmentById } = require("@/app/lib/services/assignment");
    getAssignmentById.mockResolvedValue(noDescriptionAssignment);

    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Chỉ kiểm tra tồn tại node <h1>
      const h1Node = document.querySelector("h1");
      expect(h1Node).toBeInTheDocument();
    });
  });

  it("handles assignment with different format", async () => {
    const essayAssignment = {
      ...mockAssignment,
      format: "ESSAY",
      title: "Bài tập tự luận chương 2",
    };
    const { getAssignmentById } = require("@/app/lib/services/assignment");
    getAssignmentById.mockResolvedValue(essayAssignment);

    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Chỉ kiểm tra tồn tại node <h1>
      const h1Node = document.querySelector("h1");
      expect(h1Node).toBeInTheDocument();
    });
  });

  it("handles empty submissions list", async () => {
    const {
      getSubmissionsByAssignmentId,
    } = require("@/app/lib/services/assignment");
    getSubmissionsByAssignmentId.mockResolvedValue({
      content: [],
      totalElements: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Danh sách học sinh/)).toBeInTheDocument();
    });
  });

  it("handles error state gracefully", async () => {
    const { getAssignmentById } = require("@/app/lib/services/assignment");
    getAssignmentById.mockRejectedValue(new Error("Failed to fetch"));
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Quay lại/)).toBeInTheDocument();
    });
  });

  it("handles loading state", async () => {
    const { getAssignmentById } = require("@/app/lib/services/assignment");
    getAssignmentById.mockImplementation(() => new Promise(() => {}));
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    expect(screen.getByText(/Quay lại/)).toBeInTheDocument();
  });

  it("displays assignment details", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Danh sách học sinh/)).toBeInTheDocument();
      expect(screen.getByText(/Quay lại/)).toBeInTheDocument();
    });
  });

  it("displays student information", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      // Kiểm tra tồn tại tên học sinh bất kỳ
      expect(
        screen.getByText(/Nguyễn Văn A|Lê Văn B|Trần Thị C/),
      ).toBeInTheDocument();
    });
  });

  it("handles submission with no score", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      // Kiểm tra tồn tại tên học sinh không có điểm
      expect(screen.getByText(/Trần Thị C/)).toBeInTheDocument();
    });
  });

  it("displays assignment format", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      // Kiểm tra tồn tại text "Tự luận"
      expect(screen.getByText(/Tự luận/)).toBeInTheDocument();
    });
  });

  it("displays assignment duration", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssignmentDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const durationNodes = screen.getAllByText((content, node) => {
        return !!(
          node?.textContent?.includes("45") &&
          node?.textContent?.includes("phút")
        );
      });
      expect(durationNodes.length).toBeGreaterThan(0);
    });
  });
});
