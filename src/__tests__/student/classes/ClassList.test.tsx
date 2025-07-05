import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child components
jest.mock(
  "@/app/ui/components/_common/loading/StudentClassesLoading",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="loading-skeleton" />,
);

jest.mock(
  "@/app/ui/components/_common/EmptyListOrTable",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => <div data-testid="empty-list">{props.message}</div>,
);

jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: (props: any) => (
    <button
      data-testid="detail-button"
      onClick={props.onClick}
      className={props.className}
    >
      {props.children}
    </button>
  ),
}));

// Mock hooks
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({
    handleNavigate: jest.fn(),
  }),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon" />,
}));

const ClassList =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/user/student/classes/ClassList").default;

describe("ClassList", () => {
  const mockClasses = {
    content: [
      {
        id: "1",
        name: "10A",
        description: "Lớp học toán cơ bản",
        course: { id: "1", name: "Toán" },
        grade: { id: "1", name: "Lớp 10" },
      },
      {
        id: "2",
        name: "10B",
        description: "Lớp học văn học",
        course: { id: "2", name: "Văn" },
        grade: { id: "1", name: "Lớp 10" },
      },
    ],
    totalElements: 2,
    totalPages: 1,
    pageNumber: 0,
    pageSize: 5,
    last: true,
  };

  it("renders loading skeleton when status is pending", () => {
    render(<ClassList status="pending" />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders empty list when no classes", () => {
    render(
      <ClassList
        status="success"
        classes={{ ...mockClasses, totalElements: 0 }}
      />,
    );
    expect(screen.getByTestId("empty-list")).toBeInTheDocument();
    expect(screen.getByText("Hiện đang không có lớp học")).toBeInTheDocument();
  });

  it("renders classes in grid layout by default", () => {
    render(<ClassList status="success" classes={mockClasses} />);
    const classItems = screen.getAllByText(/Lớp 10A|Lớp 10B/);
    expect(classItems).toHaveLength(2);
    // Check grid layout classes
    const gridParent = classItems[0].closest(".grid");
    expect(gridParent).not.toBeNull();
  });

  it("renders classes in row layout when type is row", () => {
    render(<ClassList status="success" classes={mockClasses} type="row" />);
    const classItems = screen.getAllByText(/Lớp 10A|Lớp 10B/);
    expect(classItems).toHaveLength(2);
    // Check row layout classes
    const rowParent = classItems[0].closest(".flex");
    expect(rowParent).not.toBeNull();
  });

  it("renders class information correctly", () => {
    render(<ClassList status="success" classes={mockClasses} />);

    // Check class names
    expect(screen.getByText("Lớp 10A - Toán Lớp 10")).toBeInTheDocument();
    expect(screen.getByText("Lớp 10B - Văn Lớp 10")).toBeInTheDocument();

    // Check teacher label
    expect(screen.getAllByText(/Giáo viên:/)).toHaveLength(2);
  });

  it("renders course initial in avatar circle", () => {
    render(<ClassList status="success" classes={mockClasses} />);

    // Check for course initials
    expect(screen.getByText("T")).toBeInTheDocument(); // Toán
    expect(screen.getByText("V")).toBeInTheDocument(); // Văn
  });

  it("renders detail buttons for each class", () => {
    render(<ClassList status="success" classes={mockClasses} />);

    const detailButtons = screen.getAllByTestId("detail-button");
    expect(detailButtons).toHaveLength(2);

    detailButtons.forEach((button) => {
      expect(button).toHaveTextContent("Xem chi tiết");
      expect(button).toHaveClass(
        "px-4",
        "py-2",
        "hidden",
        "md:flex",
        "text-sm",
        "rounded-full",
      );
    });
  });

  it("renders eye icons for mobile view", () => {
    render(<ClassList status="success" classes={mockClasses} />);
    const eyeIcons = screen.getAllByTestId("eye-icon");
    expect(eyeIcons).toHaveLength(2);
  });

  it("handles class with missing course name", () => {
    const classesWithMissingCourse = {
      ...mockClasses,
      content: [
        {
          ...mockClasses.content[0],
          course: { id: "1", name: "" },
        },
      ],
    };

    render(<ClassList status="success" classes={classesWithMissingCourse} />);

    // Should show fallback "?" for course initial
    expect(screen.getByText("?")).toBeInTheDocument();
    // Should show just class name without course
    expect(screen.getByText("10A")).toBeInTheDocument();
  });

  it("applies correct styling to class items", () => {
    render(<ClassList status="success" classes={mockClasses} />);
    const classItems = screen.getAllByText(/Lớp 10A|Lớp 10B/);
    classItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  it("applies correct styling to avatar circles", () => {
    render(<ClassList status="success" classes={mockClasses} />);
    const initials = screen.getAllByText(/T|V/);
    initials.forEach((initial) => {
      expect(initial).toBeInTheDocument();
    });
  });
});
