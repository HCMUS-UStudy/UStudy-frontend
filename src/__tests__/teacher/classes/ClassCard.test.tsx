import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import ClassCard from "@/app/ui/components/user/teacher/ClassCard";
import { ClassTeacher } from "@/app/types";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Teacher ClassCard Component", () => {
  const mockClass: ClassTeacher = {
    id: "1",
    name: "Lớp 10A",
    description: "Lớp học toán cơ bản",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "PROGRESS",
    course: {
      id: "1",
      name: "Toán",
      description: "Môn toán cơ bản",
      totalGrades: 10,
      status: true,
      createdBy: {
        id: "teacher1",
        genId: "T001",
        email: "teacher@example.com",
        name: "Teacher Name",
        avatar: "avatar.jpg",
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
  };

  it("renders class name", () => {
    render(<ClassCard cls={mockClass} completed={false} />);
    expect(screen.getByText("Lớp 10A")).toBeInTheDocument();
  });

  it("renders course and grade information", () => {
    render(<ClassCard cls={mockClass} completed={false} />);
    expect(screen.getByText("Toán - Lớp 10")).toBeInTheDocument();
  });

  it("renders student amount", () => {
    render(<ClassCard cls={mockClass} completed={false} />);
    expect(screen.getByText("25 học sinh")).toBeInTheDocument();
  });

  it("applies correct styling for ongoing class", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const card = screen.getByText("Lớp 10A").closest("div");
    expect(card).toHaveClass(
      "bg-white",
      "hover:shadow-md",
      "hover:shadow-primary-light",
    );
    expect(card).not.toHaveClass("bg-slate-100", "hover:bg-slate-200");
  });

  it("applies correct styling for completed class", () => {
    render(<ClassCard cls={mockClass} completed={true} />);

    const card = screen.getByText("Lớp 10A").closest("div");
    expect(card).toHaveClass("bg-slate-100", "hover:bg-slate-200");
    expect(card).not.toHaveClass(
      "bg-white",
      "hover:shadow-md",
      "hover:shadow-primary-light",
    );
  });

  it("has cursor pointer class", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const card = screen.getByText("Lớp 10A").closest("div");
    expect(card).toHaveClass("cursor-pointer");
  });

  it("has correct border and shadow classes", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const card = screen.getByText("Lớp 10A").closest("div");
    expect(card).toHaveClass(
      "border",
      "border-slate-200",
      "rounded-2xl",
      "shadow-sm",
    );
  });

  it("has correct padding", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const card = screen.getByText("Lớp 10A").closest("div");
    expect(card).toHaveClass("p-5");
  });

  it("handles class with missing course name", () => {
    const classWithoutCourse = {
      ...mockClass,
      course: {
        id: "1",
        name: "",
        description: "Môn toán cơ bản",
        totalGrades: 10,
        status: true,
        createdBy: {
          id: "teacher1",
          genId: "T001",
          email: "teacher@example.com",
          name: "Teacher Name",
          avatar: "avatar.jpg",
          role: "TEACHER",
          gender: "MALE",
          createdAt: "2024-01-01",
          active: true,
        },
        createdAt: "2024-01-01",
      },
    };

    render(<ClassCard cls={classWithoutCourse} completed={false} />);
    // Use getAllByText and check at least one node matches
    const nodes = screen.getAllByText((content, node) => {
      if (!node) return false;
      const textContent = node.textContent?.replace(/\s+/g, " ") || "";
      return textContent.includes("- Lớp 10");
    });
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("handles class with missing grade name", () => {
    const classWithoutGrade = {
      ...mockClass,
      grade: { id: "1", name: "" },
    };

    render(<ClassCard cls={classWithoutGrade} completed={false} />);
    const nodes = screen.getAllByText((content, node) => {
      if (!node) return false;
      const textContent = node.textContent?.replace(/\s+/g, " ") || "";
      return textContent.includes("Toán -");
    });
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("handles zero student amount", () => {
    const classWithZeroStudents = {
      ...mockClass,
      studentAmount: 0,
    };

    render(<ClassCard cls={classWithZeroStudents} completed={false} />);
    expect(screen.getByText("0 học sinh")).toBeInTheDocument();
  });

  it("handles large student amount", () => {
    const classWithManyStudents = {
      ...mockClass,
      studentAmount: 100,
    };

    render(<ClassCard cls={classWithManyStudents} completed={false} />);
    expect(screen.getByText("100 học sinh")).toBeInTheDocument();
  });

  it("renders course name in badge style", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const courseBadge = screen.getByText("Toán - Lớp 10");
    expect(courseBadge).toHaveClass(
      "bg-gray-200",
      "rounded-lg",
      "text-xs",
      "md:text-sm",
      "text-slate-800",
      "w-fit",
      "px-1",
      "mt-1",
    );
  });

  it("renders student amount with correct styling", () => {
    render(<ClassCard cls={mockClass} completed={false} />);

    const studentAmount = screen.getByText("25 học sinh");
    expect(studentAmount).toHaveClass(
      "flex-col",
      "py-2",
      "text-xs",
      "md:text-sm",
    );
  });
});
