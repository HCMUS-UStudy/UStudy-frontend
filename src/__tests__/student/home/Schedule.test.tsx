jest.mock("@/app/lib/services/classSchedule", () => ({
  getPersonalClassSchedule: jest.fn().mockResolvedValue({
    data: {
      data: [
        {
          classSession: {
            clazz: {
              course: { name: "Toán" },
              grade: { name: "10A1" },
              teacher: { name: "GV A" },
            },
            session: { startTime: "08:00", endTime: "09:00", name: "Sáng" },
            room: { name: "Phòng 1" },
          },
          date: new Date().toISOString(),
        },
      ],
    },
  }),
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Schedule from "@/app/ui/components/user/student/home/Schedule";

describe("Schedule", () => {
  it("hiển thị loading khi đang tải dữ liệu", () => {
    render(<Schedule />);
    expect(
      screen.getAllByText((content, element) => {
        return !!element?.className.includes("bg-gray-200");
      }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("hiển thị lịch học sau khi tải xong", async () => {
    render(<Schedule />);
    await waitFor(() => {
      expect(screen.getByText("Toán")).toBeInTheDocument();
      expect(screen.getByText("10A1")).toBeInTheDocument();
      expect(screen.getByText("GV A")).toBeInTheDocument();
      expect(screen.getByText("Phòng 1")).toBeInTheDocument();
    });
  });
});
