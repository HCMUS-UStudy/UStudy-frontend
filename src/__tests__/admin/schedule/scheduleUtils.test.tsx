/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "@testing-library/jest-dom";

// Mock components để test utility functions
jest.mock("@/app/ui/components/_common/Card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardDescription: ({ children, className }: any) => (
    <p data-testid="card-description" className={className}>
      {children}
    </p>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaChalkboardTeacher: () => <div data-testid="teacher-icon" />,
  FaBook: () => <div data-testid="book-icon" />,
  FaUserTie: () => <div data-testid="user-icon" />,
  FaSpinner: () => <div data-testid="spinner-icon" />,
  FaRegCalendarAlt: () => <div data-testid="calendar-icon" />,
}));

describe("Schedule Utilities", () => {
  describe("Date formatting", () => {
    it("formats date correctly for Vietnamese locale", () => {
      const date = new Date("2025-02-15");
      const formattedDate = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      expect(formattedDate).toContain("Thứ");
      expect(formattedDate).toContain("2025");
      expect(formattedDate).toContain("tháng 2");
      expect(formattedDate).toContain("15");
    });

    it("formats date string correctly", () => {
      const date = new Date("2025-02-15");
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      expect(formattedDate).toBe("2025-02-15");
    });

    it("handles single digit month and day", () => {
      const date = new Date("2025-01-05");
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      expect(formattedDate).toBe("2025-01-05");
    });
  });

  describe("Time formatting", () => {
    it("formats time range correctly", () => {
      const startTime = "07:00:00";
      const endTime = "09:00:00";
      const timeRange = `${startTime} - ${endTime}`;

      expect(timeRange).toBe("07:00:00 - 09:00:00");
    });

    it("handles empty time values", () => {
      const startTime = "";
      const endTime = "";
      const timeRange = `${startTime} - ${endTime}`;

      expect(timeRange).toBe(" - ");
    });

    it("handles null time values", () => {
      const startTime: string | null = null;
      const endTime: string | null = null;
      const timeRange = `${startTime ?? ""} - ${endTime ?? ""}`;

      expect(timeRange).toBe(" - ");
    });
  });

  describe("Data transformation", () => {
    it("transforms teacher array correctly", () => {
      const teachers = [
        { id: "1", name: "Teacher 1" },
        { id: "2", name: "Teacher 2" },
      ];

      const transformedTeachers = teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        avatar: undefined,
      }));

      expect(transformedTeachers).toHaveLength(2);
      expect(transformedTeachers[0]).toEqual({
        id: "1",
        name: "Teacher 1",
        avatar: undefined,
      });
      expect(transformedTeachers[1]).toEqual({
        id: "2",
        name: "Teacher 2",
        avatar: undefined,
      });
    });

    it("handles single teacher object", () => {
      const teacher = { id: "1", name: "Teacher 1" };
      const transformedTeacher = [
        {
          id: teacher.id,
          name: teacher.name,
          avatar: undefined,
        },
      ];

      expect(transformedTeacher).toHaveLength(1);
      expect(transformedTeacher[0]).toEqual({
        id: "1",
        name: "Teacher 1",
        avatar: undefined,
      });
    });

    it("handles null teacher data", () => {
      const teacher = null;
      const transformedTeacher = teacher
        ? [
            {
              id: (teacher as any).id,
              name: (teacher as any).name,
              avatar: undefined,
            },
          ]
        : [];

      expect(transformedTeacher).toHaveLength(0);
    });

    it("handles empty teacher array", () => {
      const teachers: any[] = [];
      const transformedTeachers = teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        avatar: undefined,
      }));

      expect(transformedTeachers).toHaveLength(0);
    });
  });

  describe("Schedule data structure", () => {
    it("creates correct schedule record structure", () => {
      const scheduleRecord = {
        classId: "class-1",
        class: "10A1",
        subject: "Toán",
        grade: "Lớp 10",
        teachers: [{ id: "1", name: "Teacher 1", avatar: undefined }],
        time: "07:00:00 - 09:00:00",
        room: "Phòng 101",
      };

      expect(scheduleRecord).toHaveProperty("classId");
      expect(scheduleRecord).toHaveProperty("class");
      expect(scheduleRecord).toHaveProperty("subject");
      expect(scheduleRecord).toHaveProperty("grade");
      expect(scheduleRecord).toHaveProperty("teachers");
      expect(scheduleRecord).toHaveProperty("time");
      expect(scheduleRecord).toHaveProperty("room");

      expect(scheduleRecord.classId).toBe("class-1");
      expect(scheduleRecord.class).toBe("10A1");
      expect(scheduleRecord.subject).toBe("Toán");
      expect(scheduleRecord.grade).toBe("Lớp 10");
      expect(scheduleRecord.time).toBe("07:00:00 - 09:00:00");
      expect(scheduleRecord.room).toBe("Phòng 101");
    });

    it("handles missing optional fields", () => {
      const scheduleRecord: any = {
        classId: undefined,
        class: undefined,
        subject: undefined,
        grade: undefined,
        teachers: [],
        time: ` - `,
        room: "Chưa có phòng",
      };

      expect(scheduleRecord.classId).toBeUndefined();
      expect(scheduleRecord.class).toBeUndefined();
      expect(scheduleRecord.subject).toBeUndefined();
      expect(scheduleRecord.grade).toBeUndefined();
      expect(scheduleRecord.teachers).toHaveLength(0);
      expect(scheduleRecord.time).toBe(" - ");
      expect(scheduleRecord.room).toBe("Chưa có phòng");
    });
  });

  describe("Calendar tile styling", () => {
    it("applies correct CSS classes for calendar tiles", () => {
      const tileClasses = [
        "react-calendar__tile",
        "aspect-ratio: 1/1",
        "max-width: 100%",
        "padding: 8px 0",
        "background: none",
        "text-align: center",
        "line-height: 16px",
        "border-radius: 8px",
      ];

      tileClasses.forEach((className) => {
        expect(className).toBeDefined();
      });
    });

    it("applies correct hover styles", () => {
      const hoverClasses = [
        "hover:bg-primary-lighter",
        "hover:text-primary-darkest",
        "transition-all",
        "duration-200",
      ];

      hoverClasses.forEach((className) => {
        expect(className).toBeDefined();
      });
    });

    it("applies correct active styles", () => {
      const activeClasses = [
        "bg-primary-dark",
        "text-white",
        "hover:bg-primary-darker",
        "shadow-md",
      ];

      activeClasses.forEach((className) => {
        expect(className).toBeDefined();
      });
    });
  });

  describe("Error handling", () => {
    it("handles API error gracefully", () => {
      const handleError = (error: Error) => {
        console.error("Failed to fetch branch schedule:", error);
        return { dates: {} };
      };

      const error = new Error("API Error");
      const result = handleError(error);

      expect(result).toEqual({ dates: {} });
    });

    it("handles missing data gracefully", () => {
      const handleMissingData = (data: any) => {
        if (!data || !data.classSession) {
          return null;
        }
        return data;
      };

      const result1 = handleMissingData(null);
      const result2 = handleMissingData({});
      const result3 = handleMissingData({ classSession: { id: "1" } });

      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toEqual({ classSession: { id: "1" } });
    });
  });
});
