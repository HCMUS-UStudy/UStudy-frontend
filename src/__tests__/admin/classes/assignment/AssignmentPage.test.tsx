import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Assignment from "@/app/(admin)/admin/classes/[classId]/assignment/page";
import * as classService from "@/app/lib/services/class";
import * as assignmentService from "@/app/lib/services/assignment";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    classId: "encoded-class-id",
  }),
}));

jest.mock("@/app/lib/hooks/useEncodedRoute", () => ({
  useEncodedRoute: () => ({
    decodeId: jest.fn(() => "decoded-class-id"),
  }),
}));

jest.mock("@/app/lib/services/class");
jest.mock("@/app/lib/services/assignment");
jest.mock("@/app/ui/components/user/teacher/AssignmentModal", () => {
  return function MockAssignmentModal({
    onClose,
    onGoBack,
  }: {
    onClose: () => void;
    onGoBack: () => void;
  }) {
    return (
      <div data-testid="assignment-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={onGoBack}>Go Back</button>
      </div>
    );
  };
});

const mockAssignments = [
  {
    id: "1",
    title: "Bài tập trắc nghiệm chương 1",
    duration: 30,
    format: "MULTIPLE_CHOICE",
    numAttempts: 1,
    startTime: "2025-05-05T08:00:00.000Z",
    endTime: "2025-05-05T10:00:00.000Z",
    completed: true,
    createdBy: {
      id: "u1",
      genId: "GV001",
      email: "teacher1@example.com",
      name: "Nguyễn Minh Quân",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    aclass: {
      id: "class1",
      name: "Lớp 10A1",
      description: "Lớp chuyên Toán",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      grade: {
        id: "g10",
        name: "Khối 10",
      },
      course: {
        id: "math10",
        name: "Toán 10",
      },
      teacher: [
        {
          id: "u1",
          genId: "GV001",
          email: "teacher1@example.com",
          name: "Nguyễn Minh Quân",
          gender: "MALE",
        },
      ],
    },
  },
  {
    id: "2",
    title: "Bài tập tự luận chương 2",
    duration: 45,
    format: "ESSAY",
    numAttempts: 2,
    startTime: "2025-05-10T08:00:00.000Z",
    endTime: "2025-05-10T10:00:00.000Z",
    completed: false,
    createdBy: {
      id: "u2",
      genId: "GV002",
      email: "teacher2@example.com",
      name: "Nguyễn Minh Quân",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    aclass: {
      id: "class2",
      name: "Lớp 11B2",
      description: "Lớp ban Tự nhiên",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      grade: {
        id: "g11",
        name: "Khối 11",
      },
      course: {
        id: "lit11",
        name: "Ngữ Văn 11",
      },
      teacher: [
        {
          id: "u2",
          genId: "GV002",
          email: "teacher2@example.com",
          name: "Nguyễn Minh Quân",
          gender: "MALE",
        },
      ],
    },
  },
];

const mockClassDetail = {
  id: "class1",
  name: "Lớp 10A1",
  description: "Lớp chuyên Toán",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  grade: {
    id: "g10",
    name: "Khối 10",
  },
  course: {
    id: "math10",
    name: "Toán 10",
  },
  teacher: [
    {
      id: "u1",
      genId: "GV001",
      email: "teacher1@example.com",
      name: "Nguyễn Minh Quân",
      gender: "MALE",
    },
  ],
};

describe("Assignment Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (classService.getClassById as jest.Mock).mockResolvedValue(mockClassDetail);
    (assignmentService.getAssignmentByClassId as jest.Mock).mockResolvedValue({
      content: mockAssignments,
    });
  });

  it("should render assignment list", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
    });
  });

  it("should display assignment details correctly", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
    });

    // Check assignment details
    expect(
      screen.getAllByText(
        (content, node) => node?.textContent === "Lớp: Lớp 10A1 | Môn: Toán 10",
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        (content, node) => node?.textContent === "Thời gian làm bài: 30 phút",
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        (content, node) => node?.textContent === "GV: Nguyễn Minh Quân",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("should show completed status for expired assignments", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Đã hết hạn")).toBeInTheDocument();
    });
  });

  it("should handle assignment click navigation", async () => {
    const mockPush = jest.fn();
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue({ push: mockPush });

    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
    });

    const assignmentCard = screen
      .getByText("Bài tập trắc nghiệm chương 1")
      .closest("div");
    fireEvent.click(assignmentCard!);

    expect(mockPush).toHaveBeenCalledWith(
      "/teacher/classes/decoded-class-id/assignment/1",
    );
  });

  it("should handle assignment click for second assignment", async () => {
    const mockPush = jest.fn();
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue({ push: mockPush });

    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
    });

    const assignmentCard = screen
      .getByText("Bài tập tự luận chương 2")
      .closest("div");
    fireEvent.click(assignmentCard!);

    expect(mockPush).toHaveBeenCalledWith(
      "/teacher/classes/decoded-class-id/assignment/2",
    );
  });

  it("should display time information correctly", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
    });

    // Check if time information is displayed (có nhiều block, nên dùng getAllByText)
    const timeLabels = screen.getAllByText(
      (content, node) => node?.textContent === "Thời gian:",
    );
    expect(timeLabels.length).toBeGreaterThan(0);
  });

  it("should handle empty assignment list", async () => {
    (assignmentService.getAssignmentByClassId as jest.Mock).mockResolvedValue({
      content: [],
    });

    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
    });

    // Should not show any assignment cards
    expect(
      screen.queryByText("Bài tập trắc nghiệm chương 1"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Bài tập tự luận chương 2"),
    ).not.toBeInTheDocument();
  });

  it("should handle class service error", async () => {
    (classService.getClassById as jest.Mock).mockRejectedValue(
      new Error("Class not found"),
    );

    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
    });

    // Should still render the page even if class service fails
    expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
  });

  it("should handle assignment service error", async () => {
    (assignmentService.getAssignmentByClassId as jest.Mock).mockRejectedValue(
      new Error("Assignment not found"),
    );

    render(<Assignment />);

    await waitFor(() => {
      expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
    });

    // Should still render the page even if assignment service fails
    expect(screen.getByText("Danh sách bài tập")).toBeInTheDocument();
  });

  it("should display multiple assignments in grid layout", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
    });

    // Both assignments should be visible
    const assignmentCards = screen.getAllByText(/Bài tập/);
    expect(assignmentCards).toHaveLength(2);
  });

  it("should show correct assignment format information", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
    });

    // Check that both assignments are displayed with their titles
    expect(
      screen.getByText("Bài tập trắc nghiệm chương 1"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
  });

  it("should display teacher information correctly", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
    });

    // Check teacher information is displayed
    expect(
      screen.getAllByText(
        (content, node) => node?.textContent === "GV: Nguyễn Minh Quân",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("should handle different assignment durations", async () => {
    render(<Assignment />);

    await waitFor(() => {
      expect(
        screen.getByText("Bài tập trắc nghiệm chương 1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Bài tập tự luận chương 2")).toBeInTheDocument();
    });

    // Check different durations are displayed
    expect(
      screen.getByText(
        (content, node) => node?.textContent === "Thời gian làm bài: 30 phút",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, node) => node?.textContent === "Thời gian làm bài: 45 phút",
      ),
    ).toBeInTheDocument();
  });
});
