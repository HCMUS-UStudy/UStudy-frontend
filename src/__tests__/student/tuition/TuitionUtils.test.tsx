// Utility functions extracted from StudentTuition component
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "text-green-600 bg-green-100";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "OVERDUE":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600";
  }
};

const getStatusName = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Đã thanh toán";
    case "PENDING":
      return "Chờ thanh toán";
    case "OVERDUE":
      return "Quá hạn";
    default:
      return status;
  }
};

describe("Tuition Utils", () => {
  describe("formatCurrency", () => {
    it("formats currency correctly for Vietnamese VND", () => {
      expect(formatCurrency(1000000).replace(/\s/g, "")).toBe("1.000.000₫");
      expect(formatCurrency(500000).replace(/\s/g, "")).toBe("500.000₫");
      expect(formatCurrency(1234567).replace(/\s/g, "")).toBe("1.234.567₫");
      expect(formatCurrency(0).replace(/\s/g, "")).toBe("0₫");
    });

    it("handles decimal amounts", () => {
      // VND sẽ làm tròn tất cả số về số nguyên
      expect(formatCurrency(1234.56).replace(/\s/g, "")).toBe("1.235₫");
    });

    it("handles negative amounts", () => {
      expect(formatCurrency(-1000000).replace(/\s/g, "")).toBe("-1.000.000₫");
      expect(formatCurrency(-500000).replace(/\s/g, "")).toBe("-500.000₫");
    });

    it("handles very large amounts", () => {
      expect(formatCurrency(1000000000).replace(/\s/g, "")).toBe(
        "1.000.000.000₫",
      );
      expect(formatCurrency(999999999999).replace(/\s/g, "")).toBe(
        "999.999.999.999₫",
      );
    });
  });

  describe("formatDate", () => {
    it("formats date string correctly", () => {
      expect(formatDate("2024-01-15")).toBe("15/1/2024");
      expect(formatDate("2024-12-25")).toBe("25/12/2024");
      expect(formatDate("2023-06-01")).toBe("1/6/2023");
    });

    it("formats Date object correctly", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("15/1/2024");
    });

    it("handles different date formats", () => {
      expect(formatDate("2024-01-15T10:30:00Z")).toBe("15/1/2024");
      expect(formatDate("2024-01-15T00:00:00.000Z")).toBe("15/1/2024");
    });

    it("handles edge cases", () => {
      expect(formatDate("2024-01-01")).toBe("1/1/2024");
      expect(formatDate("2024-12-31")).toBe("31/12/2024");
    });
  });

  describe("getStatusColor", () => {
    it("returns correct color for COMPLETED status", () => {
      expect(getStatusColor("COMPLETED")).toBe("text-green-600 bg-green-100");
    });

    it("returns correct color for PENDING status", () => {
      expect(getStatusColor("PENDING")).toBe("text-yellow-600 bg-yellow-100");
    });

    it("returns correct color for OVERDUE status", () => {
      expect(getStatusColor("OVERDUE")).toBe("text-red-600 bg-red-100");
    });

    it("returns default color for unknown status", () => {
      expect(getStatusColor("UNKNOWN")).toBe("text-gray-600");
      expect(getStatusColor("")).toBe("text-gray-600");
      expect(getStatusColor("CANCELLED")).toBe("text-gray-600");
    });

    it("is case sensitive", () => {
      expect(getStatusColor("completed")).toBe("text-gray-600");
      expect(getStatusColor("pending")).toBe("text-gray-600");
      expect(getStatusColor("overdue")).toBe("text-gray-600");
    });
  });

  describe("getStatusName", () => {
    it("returns correct Vietnamese name for COMPLETED status", () => {
      expect(getStatusName("COMPLETED")).toBe("Đã thanh toán");
    });

    it("returns correct Vietnamese name for PENDING status", () => {
      expect(getStatusName("PENDING")).toBe("Chờ thanh toán");
    });

    it("returns correct Vietnamese name for OVERDUE status", () => {
      expect(getStatusName("OVERDUE")).toBe("Quá hạn");
    });

    it("returns original status for unknown status", () => {
      expect(getStatusName("UNKNOWN")).toBe("UNKNOWN");
      expect(getStatusName("CANCELLED")).toBe("CANCELLED");
      expect(getStatusName("")).toBe("");
    });

    it("is case sensitive", () => {
      expect(getStatusName("completed")).toBe("completed");
      expect(getStatusName("pending")).toBe("pending");
      expect(getStatusName("overdue")).toBe("overdue");
    });
  });

  describe("Integration tests", () => {
    it("formats payment data correctly", () => {
      const payment = {
        id: "1",
        amount: 1500000,
        status: "PENDING",
        dueDate: "2024-01-15",
      };

      const formattedAmount = formatCurrency(payment.amount);
      const formattedDate = formatDate(payment.dueDate);
      const statusColor = getStatusColor(payment.status);
      const statusName = getStatusName(payment.status);

      expect(formattedAmount.replace(/\s/g, "")).toBe("1.500.000₫");
      expect(formattedDate).toBe("15/1/2024");
      expect(statusColor).toBe("text-yellow-600 bg-yellow-100");
      expect(statusName).toBe("Chờ thanh toán");
    });

    it("handles completed payment correctly", () => {
      const payment = {
        id: "2",
        amount: 2000000,
        status: "COMPLETED",
        dueDate: "2024-01-10",
      };

      const formattedAmount = formatCurrency(payment.amount);
      const formattedDate = formatDate(payment.dueDate);
      const statusColor = getStatusColor(payment.status);
      const statusName = getStatusName(payment.status);

      expect(formattedAmount.replace(/\s/g, "")).toBe("2.000.000₫");
      expect(formattedDate).toBe("10/1/2024");
      expect(statusColor).toBe("text-green-600 bg-green-100");
      expect(statusName).toBe("Đã thanh toán");
    });

    it("handles overdue payment correctly", () => {
      const payment = {
        id: "3",
        amount: 3000000,
        status: "OVERDUE",
        dueDate: "2023-12-31",
      };

      const formattedAmount = formatCurrency(payment.amount);
      const formattedDate = formatDate(payment.dueDate);
      const statusColor = getStatusColor(payment.status);
      const statusName = getStatusName(payment.status);

      expect(formattedAmount.replace(/\s/g, "")).toBe("3.000.000₫");
      expect(formattedDate).toBe("31/12/2023");
      expect(statusColor).toBe("text-red-600 bg-red-100");
      expect(statusName).toBe("Quá hạn");
    });
  });
});
