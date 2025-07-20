/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import QuestionDetail from "@/app/(user)/teacher/questions/[questionId]/page";

// Mock React.use for the component
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  use: jest.fn(),
}));

// Mock Next.js router
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock services
jest.mock("@/app/lib/services/question", () => ({
  getQuestionDetail: jest.fn(),
  editQuestion: jest.fn(),
  handleDownloadFile: jest.fn(),
}));

// Mock components
jest.mock("@/app/ui/components/_common/Checkbox", () => ({
  __esModule: true,
  default: ({ checked, label, onChange }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={`checkbox-${label}`}
      />
      {label}
    </label>
  ),
}));

jest.mock("@/app/ui/components/_common/FileUpload", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <div data-testid="file-upload">
      <input
        type="file"
        onChange={(e) => onChange(e.target.files?.[0], "test-file.pdf")}
        data-testid="file-input"
      />
      {value && <span>File selected: {value.name}</span>}
    </div>
  ),
}));

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoReturnUpBack: () => <span>←</span>,
}));

jest.mock("react-icons/md", () => ({
  MdOutlineEdit: () => <span>✏️</span>,
}));

jest.mock("react-icons/fa", () => ({
  FaRegTrashAlt: () => <span>🗑️</span>,
}));

// Mock toast hook
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    },
  }),
}));

// Mock lodash
jest.mock("lodash/isEqual", () => jest.fn());

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

const mockQuestion = {
  id: "q1",
  description: "Câu hỏi toán học cơ bản về phương trình bậc hai",
  grade: { id: "grade1", name: "Lớp 10" },
  course: { id: "course1", name: "Toán" },
  questionType: "MULTIPLE_CHOICE",
  lastModified: "2024-01-15T10:00:00Z",
  fileName: "question1.pdf",
  options: [
    { id: "a", description: "Đáp án A", isCorrect: true },
    { id: "b", description: "Đáp án B", isCorrect: false },
    { id: "c", description: "Đáp án C", isCorrect: false },
    { id: "d", description: "Đáp án D", isCorrect: false },
  ],
  scoringCriteria: "",
};

const mockEssayQuestion = {
  id: "q2",
  description: "Viết một bài văn nghị luận về tình bạn",
  grade: { id: "grade2", name: "Lớp 11" },
  course: { id: "course2", name: "Văn" },
  questionType: "ESSAY",
  lastModified: "2024-01-14T15:30:00Z",
  fileName: "essay-question.pdf",
  options: [],
  scoringCriteria:
    "Tiêu chí chấm điểm: Ý tưởng rõ ràng, lập luận logic, ngôn ngữ mạch lạc",
};

describe("QuestionDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock React.use to return questionId from params
    const mockUse = require("react").use;
    mockUse.mockImplementation((promise: any) => {
      if (promise && typeof promise.then === "function") {
        // If it's a Promise, return the resolved value
        return { questionId: "q1" };
      }
      return promise;
    });
    // Always mock getQuestionDetail to resolve with mockQuestion by default
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockResolvedValue(mockQuestion);
  });

  it("renders loading state initially", () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders question details after loading", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Chi tiết câu hỏi")).toBeInTheDocument();
      expect(
        screen.getByText("Câu hỏi toán học cơ bản về phương trình bậc hai"),
      ).toBeInTheDocument();
      expect(screen.getByText("Lớp 10")).toBeInTheDocument();
      expect(screen.getByText("Toán")).toBeInTheDocument();
      expect(screen.getByText("Trắc nghiệm 1 đáp án")).toBeInTheDocument();
    });
  });

  it("renders back button", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Trở về")).toBeInTheDocument();
    });
  });

  it("renders edit button when not in edit mode", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Chỉnh sửa câu hỏi")).toBeInTheDocument();
    });
  });

  it("navigates back when back button is clicked", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const backButton = screen.getByText("Trở về");
      fireEvent.click(backButton);
    });

    expect(mockBack).toHaveBeenCalled();
  });

  it("enters edit mode when edit button is clicked", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    expect(
      screen.getByDisplayValue(
        "Câu hỏi toán học cơ bản về phương trình bậc hai",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Lưu")).toBeInTheDocument();
    expect(screen.getByText("Hủy")).toBeInTheDocument();
  });

  it("shows multiple choice options correctly", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("A.")).toBeInTheDocument();
      expect(screen.getByText("B.")).toBeInTheDocument();
      expect(screen.getByText("C.")).toBeInTheDocument();
      expect(screen.getByText("D.")).toBeInTheDocument();
      expect(screen.getByText("Đáp án A")).toBeInTheDocument();
      expect(screen.getByText("Đáp án B")).toBeInTheDocument();
      expect(screen.getByText("Đúng")).toBeInTheDocument();
    });
  });

  it("shows essay question details correctly", async () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockResolvedValue(mockEssayQuestion);
    // Mock React.use to return q2 for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "q2" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q2" })} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Viết một bài văn nghị luận về tình bạn"),
      ).toBeInTheDocument();
      expect(screen.getByText("Tự luận")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Tiêu chí chấm điểm: Ý tưởng rõ ràng, lập luận logic, ngôn ngữ mạch lạc",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows file attachment when available", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("question1.pdf")).toBeInTheDocument();
    });
  });

  it("allows editing question description", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    const descriptionInput = screen.getByDisplayValue(
      "Câu hỏi toán học cơ bản về phương trình bậc hai",
    );
    fireEvent.change(descriptionInput, {
      target: { value: "Câu hỏi đã được chỉnh sửa" },
    });

    expect(
      screen.getByDisplayValue("Câu hỏi đã được chỉnh sửa"),
    ).toBeInTheDocument();
  });

  it("allows editing multiple choice options", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    const optionInput = screen.getByDisplayValue("Đáp án A");
    fireEvent.change(optionInput, {
      target: { value: "Đáp án A đã chỉnh sửa" },
    });

    expect(
      screen.getByDisplayValue("Đáp án A đã chỉnh sửa"),
    ).toBeInTheDocument();
  });

  it("allows adding new options", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    const addButton = screen.getByText("+ Thêm đáp án");
    fireEvent.click(addButton);

    // Should show new option input
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("allows editing scoring criteria for essay questions", async () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockResolvedValue(mockEssayQuestion);
    // Mock React.use to return q2 for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "q2" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q2" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    const criteriaInput = screen.getByDisplayValue(
      "Tiêu chí chấm điểm: Ý tưởng rõ ràng, lập luận logic, ngôn ngữ mạch lạc",
    );
    fireEvent.change(criteriaInput, { target: { value: "Tiêu chí mới" } });

    expect(screen.getByDisplayValue("Tiêu chí mới")).toBeInTheDocument();
  });

  it("handles file upload for essay questions", async () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    // No file attached
    mockGetQuestionDetail.mockResolvedValue({
      ...mockEssayQuestion,
      fileName: undefined,
    });
    // Mock React.use to return q2 for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "q2" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q2" })} />,
    );

    await waitFor(() => {
      // Check that no file attachment is shown
      expect(screen.queryByText("essay-question.pdf")).not.toBeInTheDocument();
    });
  });

  it("shows file name for essay questions with file", async () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockResolvedValue(mockEssayQuestion);
    // Mock React.use to return q2 for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "q2" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q2" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("essay-question.pdf")).toBeInTheDocument();
    });
  });

  it("shows error state when question is not found", async () => {
    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockRejectedValue(new Error("Question not found"));
    // Mock React.use to return invalid for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "invalid" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "invalid" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Không tìm thấy câu hỏi.")).toBeInTheDocument();
    });
  });

  it("formats date correctly", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      // Check if date is formatted (should contain Vietnamese locale format)
      const dateElement = screen.getByText(
        (content) =>
          content.includes("15/1/2024") || content.includes("15/01/2024"),
      );
      expect(dateElement).toBeInTheDocument();
    });
  });

  it("shows multiple choice type correctly for single answer", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Trắc nghiệm 1 đáp án")).toBeInTheDocument();
    });
  });

  it("shows multiple choice type correctly for multiple answers", async () => {
    const multipleAnswerQuestion = {
      ...mockQuestion,
      options: [
        { id: "a", description: "Đáp án A", isCorrect: true },
        { id: "b", description: "Đáp án B", isCorrect: true },
        { id: "c", description: "Đáp án C", isCorrect: false },
        { id: "d", description: "Đáp án D", isCorrect: false },
      ],
    };

    const mockGetQuestionDetail =
      require("@/app/lib/services/question").getQuestionDetail;
    mockGetQuestionDetail.mockResolvedValue(multipleAnswerQuestion);
    // Mock React.use to return q1 for this test
    const mockUse = require("react").use;
    mockUse.mockReturnValue({ questionId: "q1" });

    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Trắc nghiệm nhiều đáp án")).toBeInTheDocument();
    });
  });

  it("cancels edit mode when cancel button is clicked", async () => {
    renderWithQueryClient(
      <QuestionDetail params={Promise.resolve({ questionId: "q1" })} />,
    );

    await waitFor(() => {
      const editButton = screen.getByText("Chỉnh sửa câu hỏi");
      fireEvent.click(editButton);
    });

    const cancelButton = screen.getByText("Hủy");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Lưu")).not.toBeInTheDocument();
    expect(screen.getByText("Chỉnh sửa câu hỏi")).toBeInTheDocument();
  });
});
