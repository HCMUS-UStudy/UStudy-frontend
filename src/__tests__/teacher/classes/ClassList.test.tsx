import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import ClassList from "@/app/ui/components/user/teacher/ClassList";
import { ClassTeacher } from "@/app/types";

// Mock the ClassCard component
jest.mock("@/app/ui/components/user/teacher/ClassCard", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockClassCard({ cls, completed }: any) {
    return (
      <div data-testid={`class-card-${cls.id}`} data-completed={completed}>
        <h3>{cls.name}</h3>
        <p>
          {cls.course?.name} - {cls.grade.name}
        </p>
        <span>{cls.studentAmount} học sinh</span>
      </div>
    );
  };
});

describe("Teacher ClassList Component", () => {
  const mockClasses: ClassTeacher[] = [
    {
      id: "1",
      name: "Lớp 10A",
      description: "Lớp học toán cơ bản",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      status: "PROGRESS",
      course: {
        id: "1",
        name: "Toán",
        description: "",
        totalGrades: 0,
        status: true,
        createdBy: {
          id: "1",
          genId: "teacher1",
          email: "teacher1@example.com",
          name: "Teacher One",
          avatar: "",
          role: "TEACHER",
          gender: "MALE",
          createdAt: "2024-01-01",
          active: true,
        },
        createdAt: "2024-01-01",
      },
      grade: { id: "1", name: "Lớp 10" },
      studentAmount: 25,
      classSessions: [],
    },
    {
      id: "2",
      name: "Lớp 10B",
      description: "Lớp học văn học",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      status: "COMPLETED",
      course: {
        id: "2",
        name: "Văn",
        description: "",
        totalGrades: 0,
        status: true,
        createdBy: {
          id: "2",
          genId: "teacher2",
          email: "teacher2@example.com",
          name: "Teacher Two",
          avatar: "",
          role: "TEACHER",
          gender: "FEMALE",
          createdAt: "2024-01-01",
          active: true,
        },
        createdAt: "2024-01-01",
      },
      grade: { id: "1", name: "Lớp 10" },
      studentAmount: 30,
      classSessions: [],
    },
  ];

  it("renders class list with correct grid layout", () => {
    render(<ClassList classes={mockClasses} completed={false} />);
    // Query by className grid
    const gridDiv = document.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4",
    );
    expect(gridDiv).toBeInTheDocument();
  });

  it("renders all class cards", () => {
    render(<ClassList classes={mockClasses} completed={false} />);
    expect(screen.getByTestId("class-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("class-card-2")).toBeInTheDocument();
  });

  it("passes correct props to class cards", () => {
    render(<ClassList classes={mockClasses} completed={false} />);
    const classCard1 = screen.getByTestId("class-card-1");
    const classCard2 = screen.getByTestId("class-card-2");
    expect(classCard1).toHaveAttribute("data-completed", "false");
    expect(classCard2).toHaveAttribute("data-completed", "false");
  });

  it("renders completed classes with completed prop", () => {
    render(<ClassList classes={mockClasses} completed={true} />);
    const classCard1 = screen.getByTestId("class-card-1");
    const classCard2 = screen.getByTestId("class-card-2");
    expect(classCard1).toHaveAttribute("data-completed", "true");
    expect(classCard2).toHaveAttribute("data-completed", "true");
  });

  it("renders class information correctly", () => {
    render(<ClassList classes={mockClasses} completed={false} />);
    expect(screen.getByText("Lớp 10A")).toBeInTheDocument();
    expect(screen.getByText("Lớp 10B")).toBeInTheDocument();
    expect(screen.getByText("Toán - Lớp 10")).toBeInTheDocument();
    expect(screen.getByText("Văn - Lớp 10")).toBeInTheDocument();
    expect(screen.getByText("25 học sinh")).toBeInTheDocument();
    expect(screen.getByText("30 học sinh")).toBeInTheDocument();
  });

  it("renders empty list when no classes", () => {
    render(<ClassList classes={[]} completed={false} />);
    // Should render an empty grid
    const gridDiv = document.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4",
    );
    expect(gridDiv).toBeInTheDocument();
    expect(gridDiv?.children.length).toBe(0);
  });

  it("handles single class", () => {
    const singleClass = [mockClasses[0]];
    render(<ClassList classes={singleClass} completed={false} />);
    expect(screen.getByTestId("class-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("class-card-2")).not.toBeInTheDocument();
  });

  it("applies correct gap classes", () => {
    render(<ClassList classes={mockClasses} completed={false} />);
    const gridDiv = document.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4",
    );
    expect(gridDiv).toHaveClass("gap-3", "md:gap-5");
  });
});
