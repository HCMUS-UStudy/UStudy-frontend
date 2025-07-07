// Test utility functions that might be used in schedule components
describe("Schedule Utils", () => {
  describe("Date formatting", () => {
    it("formats date correctly for YYYY-MM-DD format", () => {
      const date = new Date("2024-01-15");
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;

      expect(formatted).toBe("2024-01-15");
    });

    it("handles single digit months and days", () => {
      const date = new Date("2024-03-05");
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;

      expect(formatted).toBe("2024-03-05");
    });

    it("handles end of year dates", () => {
      const date = new Date("2024-12-31");
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;

      expect(formatted).toBe("2024-12-31");
    });
  });

  describe("Time formatting", () => {
    it("formats time correctly for Vietnamese locale", () => {
      const date = new Date("2024-01-15T14:30:00");
      const formatted = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      expect(formatted).toBe("14:30");
    });

    it("handles midnight time", () => {
      const date = new Date("2024-01-15T00:00:00");
      const formatted = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      expect(formatted).toBe("00:00");
    });

    it("handles end of day time", () => {
      const date = new Date("2024-01-15T23:59:00");
      const formatted = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      expect(formatted).toBe("23:59");
    });
  });

  describe("Date localization", () => {
    it("formats date for Vietnamese locale", () => {
      const date = new Date("2024-01-15");
      const formatted = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // The exact format depends on the locale, but it should contain the date info
      expect(formatted).toContain("2024");
      expect(formatted).toContain("15");
    });

    it("handles different weekdays", () => {
      const monday = new Date("2024-01-15"); // Monday
      const friday = new Date("2024-01-19"); // Friday

      const mondayFormatted = monday.toLocaleDateString("vi-VN", {
        weekday: "long",
      });
      const fridayFormatted = friday.toLocaleDateString("vi-VN", {
        weekday: "long",
      });

      expect(mondayFormatted).not.toBe(fridayFormatted);
    });
  });

  describe("Schedule data processing", () => {
    it("groups schedule records by date", () => {
      const scheduleData = {
        "2024-01-15": [
          { type: "Task", title: "Assignment 1" },
          { type: "Reminder", class: "Math" },
        ],
        "2024-01-16": [{ type: "Task", title: "Assignment 2" }],
      };

      expect(scheduleData["2024-01-15"]).toHaveLength(2);
      expect(scheduleData["2024-01-16"]).toHaveLength(1);
      expect(scheduleData["2024-01-15"][0].type).toBe("Task");
      expect(scheduleData["2024-01-15"][1].type).toBe("Reminder");
    });

    it("filters tasks from schedule records", () => {
      const records = [
        { type: "Task", title: "Assignment 1" },
        { type: "Reminder", class: "Math" },
        { type: "Task", title: "Assignment 2" },
      ];

      const tasks = records.filter((record) => record.type === "Task");

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe("Assignment 1");
      expect(tasks[1].title).toBe("Assignment 2");
    });

    it("filters reminders from schedule records", () => {
      const records = [
        { type: "Task", title: "Assignment 1" },
        { type: "Reminder", class: "Math" },
        { type: "Reminder", class: "English" },
      ];

      const reminders = records.filter((record) => record.type === "Reminder");

      expect(reminders).toHaveLength(2);
      expect(reminders[0].class).toBe("Math");
      expect(reminders[1].class).toBe("English");
    });
  });

  describe("Calendar tile classification", () => {
    it("classifies tile with only tasks", () => {
      const records = [
        { type: "Task", title: "Assignment 1" },
        { type: "Task", title: "Assignment 2" },
      ];

      const hasTask = records.some((r) => r.type === "Task");
      const hasReminder = records.some((r) => r.type === "Reminder");

      expect(hasTask).toBe(true);
      expect(hasReminder).toBe(false);
    });

    it("classifies tile with only reminders", () => {
      const records = [
        { type: "Reminder", class: "Math" },
        { type: "Reminder", class: "English" },
      ];

      const hasTask = records.some((r) => r.type === "Task");
      const hasReminder = records.some((r) => r.type === "Reminder");

      expect(hasTask).toBe(false);
      expect(hasReminder).toBe(true);
    });

    it("classifies tile with both tasks and reminders", () => {
      const records = [
        { type: "Task", title: "Assignment 1" },
        { type: "Reminder", class: "Math" },
      ];

      const hasTask = records.some((r) => r.type === "Task");
      const hasReminder = records.some((r) => r.type === "Reminder");

      expect(hasTask).toBe(true);
      expect(hasReminder).toBe(true);
    });

    it("classifies empty tile", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records: any[] = [];

      const hasTask = records.some((r) => r.type === "Task");
      const hasReminder = records.some((r) => r.type === "Reminder");

      expect(hasTask).toBe(false);
      expect(hasReminder).toBe(false);
    });
  });

  describe("Navigation path generation", () => {
    it("generates assignment path for tasks", () => {
      const record = { type: "Task", classId: "123" };
      const path =
        record.type === "Task"
          ? `/member/classes/${record.classId}/assignment`
          : `/member/classes/${record.classId}/overview`;

      expect(path).toBe("/member/classes/123/assignment");
    });

    it("generates overview path for reminders", () => {
      const record = { type: "Reminder", classId: "456" };
      const path =
        record.type === "Task"
          ? `/member/classes/${record.classId}/assignment`
          : `/member/classes/${record.classId}/overview`;

      expect(path).toBe("/member/classes/456/overview");
    });
  });
});
