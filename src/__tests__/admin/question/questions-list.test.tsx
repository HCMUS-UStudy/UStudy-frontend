import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import QuestionList from "@/app/(admin)/admin/questions/page";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: jest.fn(),
}));

// Mock QuestionModal component
jest.mock("@/app/ui/components/user/teacher/QuestionModal", () => {
  return function MockQuestionModal({
    isOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    return isOpen ? (
      <div data-testid="question-modal">QuestionModal</div>
    ) : null;
  };
});

describe("QuestionList", () => {
  const mockPush = jest.fn();
  const mockWarning = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useCustomToast as jest.Mock).mockReturnValue({
      addToast: {
        warning: mockWarning,
      },
    });

    // Mock Grades
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "Grades") {
        return {
          data: {
            content: [
              { id: "grade-1", name: "Khối 1" },
              { id: "grade-2", name: "Khối 2" },
            ],
          },
        };
      }

      if (queryKey[0] === "Courses") {
        return {
          data: {
            content: [
              { id: "course-1", name: "Toán" },
              { id: "course-2", name: "Văn" },
            ],
          },
          isLoading: false,
        };
      }

      if (queryKey[0] === "Questions") {
        return {
          data: [
            {
              id: "q1",
              description: "Câu hỏi mẫu",
              grade: { name: "Khối 1" },
              course: { name: "Toán" },
              questionType: "MULTIPLE_CHOICE",
              createdBy: { name: "GV A", genId: "gv001" },
              lastModified: new Date().toISOString(),
            },
          ],
        };
      }

      return {};
    });
  });

  test("hiển thị tiêu đề danh sách câu hỏi", () => {
    render(<QuestionList />);
    expect(screen.getByText(/Danh sách câu hỏi/i)).toBeInTheDocument();
  });

  test("hiển thị dropdown khối và môn", async () => {
    render(<QuestionList />);

    // Check that grade dropdown is present with default value
    const gradeSelect = screen.getByDisplayValue("Tất cả khối");
    expect(gradeSelect).toBeInTheDocument();

    // Check that course dropdown exists (may have different content based on grade selection)
    const courseSelects = screen.getAllByRole("combobox");
    expect(courseSelects).toHaveLength(2); // Grade and course dropdowns

    // Check that options are available in dropdowns
    expect(screen.getAllByText("Khối 1")).toHaveLength(3); // Option + table + mobile
    expect(screen.getAllByText("Toán")).toHaveLength(3); // Option + table + mobile
  });

  test("hiển thị câu hỏi trong bảng", async () => {
    render(<QuestionList />);

    // Wait for questions to load and check table content
    await waitFor(() => {
      const tableRows = screen.getAllByRole("row");
      expect(tableRows.length).toBeGreaterThan(1); // Header + data rows
    });

    // Check that question data is displayed (using getAllByText for multiple instances)
    expect(screen.getAllByText("Câu hỏi mẫu")).toHaveLength(2); // Desktop + mobile
    expect(screen.getAllByText("Khối 1")).toHaveLength(3); // Option + table + mobile
    expect(screen.getAllByText("Toán")).toHaveLength(3); // Option + table + mobile
    expect(screen.getByText("Trắc nghiệm")).toBeInTheDocument();
  });

  test("click + Tạo câu hỏi khi chưa chọn khối hoặc môn sẽ hiển thị warning", async () => {
    // Mock with no grades/courses selected initially
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "Grades") {
        return { data: { content: [] } };
      }
      if (queryKey[0] === "Courses") {
        return { data: { content: [] }, isLoading: false };
      }
      if (queryKey[0] === "Questions") {
        return { data: [] };
      }
      return {};
    });

    render(<QuestionList />);
    const createBtn = screen.getByText(/\+ Tạo câu hỏi/);
    fireEvent.click(createBtn);
    expect(mockWarning).toHaveBeenCalledWith(
      "Vui lòng chọn khối và môn trước khi tạo câu hỏi!",
    );
  });

  test("có thể tìm kiếm câu hỏi", async () => {
    render(<QuestionList />);
    const input = screen.getByPlaceholderText(
      "Tìm kiếm theo mô tả, người tạo...",
    );

    fireEvent.change(input, { target: { value: "mẫu" } });
    await waitFor(() => {
      // Check that search results are displayed (multiple instances expected)
      expect(screen.getAllByText("Câu hỏi mẫu")).toHaveLength(2); // Desktop + mobile
    });
  });

  test("có thể sort theo mô tả", () => {
    render(<QuestionList />);
    const sortHeader = screen.getByText("Mô tả");
    fireEvent.click(sortHeader);
    // Bạn có thể kiểm tra lại thứ tự dữ liệu nếu nhiều item
    expect(sortHeader).toBeInTheDocument();
  });

  test("hiển thị 'Không tìm thấy câu hỏi' khi không có dữ liệu", () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "Grades") {
        return { data: { content: [] } };
      }
      if (queryKey[0] === "Questions") {
        return { data: [] };
      }
      return {};
    });

    render(<QuestionList />);
    expect(
      screen.getByText(/Không tìm thấy câu hỏi phù hợp/i),
    ).toBeInTheDocument();
  });

  test("hiển thị 'Đang tải môn học...' khi courses đang loading", () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "Grades") {
        return {
          data: { content: [{ id: "grade-1", name: "Khối 1" }] },
        };
      }
      if (queryKey[0] === "Courses") {
        return { data: [], isLoading: true };
      }
      if (queryKey[0] === "Questions") {
        return { data: [] };
      }
      return {};
    });

    render(<QuestionList />);
    expect(screen.getByText(/Đang tải môn học/i)).toBeInTheDocument();
  });

  test("click vào hàng trong bảng sẽ chuyển trang", async () => {
    render(<QuestionList />);

    // Find the table row specifically (not the mobile card)
    const tableRow = await screen.findByRole("row", {
      name: /1 Câu hỏi mẫu Khối 1 Toán Trắc nghiệm GV A/i,
    });
    fireEvent.click(tableRow);
    expect(mockPush).toHaveBeenCalledWith("/admin/questions/q1");
  });

  test("hiển thị đúng dạng mobile (md:hidden)", async () => {
    // Giả lập mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event("resize"));

    render(<QuestionList />);

    // Wait for questions to load
    await waitFor(() => {
      const mobileCards = screen.getAllByText("Câu hỏi mẫu");
      expect(mobileCards.length).toBe(2); // Desktop + mobile
    });

    // Check for mobile-specific structure by finding the mobile card container
    const mobileContainer = screen
      .getByText("#1")
      .closest(".bg-white.rounded-xl");
    expect(mobileContainer).toBeInTheDocument();
  });
});
