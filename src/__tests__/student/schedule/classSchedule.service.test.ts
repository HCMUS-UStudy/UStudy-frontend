import { getPersonalClassSchedule } from "@/app/lib/services/classSchedule";
import axios from "@/app/lib/axios";

// Mock axios
jest.mock("@/app/lib/axios", () => ({
  get: jest.fn(),
}));

describe("ClassSchedule Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls getPersonalClassSchedule with correct parameters", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            date: "2024-01-15",
            classSession: {
              clazz: {
                id: "1",
                name: "Lớp Toán 10A",
                course: { name: "Toán học" },
                grade: { name: "Lớp 10" },
              },
              session: {
                startTime: "08:00",
                endTime: "09:30",
              },
              room: {
                name: "Phòng 101",
              },
            },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getPersonalClassSchedule(1, 2024);

    expect(axios.get).toHaveBeenCalledWith("/class-schedule/list/personal", {
      params: { month: 1, year: 2024 },
    });
    expect(result).toEqual(mockResponse);
  });

  it("handles API error correctly", async () => {
    const errorMessage = "Failed to fetch schedule";
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(getPersonalClassSchedule(1, 2024)).rejects.toThrow(
      errorMessage,
    );
  });

  it("calls API with different month and year parameters", async () => {
    const mockResponse = { data: { data: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    await getPersonalClassSchedule(12, 2023);

    expect(axios.get).toHaveBeenCalledWith("/class-schedule/list/personal", {
      params: { month: 12, year: 2023 },
    });
  });

  it("handles empty response data", async () => {
    const mockResponse = { data: { data: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getPersonalClassSchedule(1, 2024);

    expect(result.data.data).toEqual([]);
  });

  it("handles response with class sessions only", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            date: "2024-01-15",
            classSession: {
              clazz: {
                id: "1",
                name: "Lớp Toán 10A",
                course: { name: "Toán học" },
                grade: { name: "Lớp 10" },
              },
              session: {
                startTime: "08:00",
                endTime: "09:30",
              },
              room: {
                name: "Phòng 101",
              },
            },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getPersonalClassSchedule(1, 2024);

    expect(result.data.data[0].classSession).toBeDefined();
    expect(result.data.data[0].assignment).toBeUndefined();
  });

  it("handles response with assignments only", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            date: "2024-01-15",
            assignment: {
              title: "Bài tập về nhà",
              endTime: "2024-01-15T23:59:00Z",
              clazz: {
                id: "1",
                name: "Lớp Toán 10A",
                course: { name: "Toán học" },
                grade: { name: "Lớp 10" },
              },
              format: "PDF",
              submitted: false,
            },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getPersonalClassSchedule(1, 2024);

    expect(result.data.data[0].assignment).toBeDefined();
    expect(result.data.data[0].classSession).toBeUndefined();
  });

  it("handles response with both class sessions and assignments", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            date: "2024-01-15",
            classSession: {
              clazz: {
                id: "1",
                name: "Lớp Toán 10A",
                course: { name: "Toán học" },
                grade: { name: "Lớp 10" },
              },
              session: {
                startTime: "08:00",
                endTime: "09:30",
              },
              room: {
                name: "Phòng 101",
              },
            },
          },
          {
            date: "2024-01-15",
            assignment: {
              title: "Bài tập về nhà",
              endTime: "2024-01-15T23:59:00Z",
              clazz: {
                id: "1",
                name: "Lớp Toán 10A",
                course: { name: "Toán học" },
                grade: { name: "Lớp 10" },
              },
              format: "PDF",
              submitted: false,
            },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getPersonalClassSchedule(1, 2024);

    expect(result.data.data).toHaveLength(2);
    expect(result.data.data[0].classSession).toBeDefined();
    expect(result.data.data[1].assignment).toBeDefined();
  });

  it("handles network timeout", async () => {
    const timeoutError = new Error("Request timeout");
    timeoutError.name = "TimeoutError";
    (axios.get as jest.Mock).mockRejectedValue(timeoutError);

    await expect(getPersonalClassSchedule(1, 2024)).rejects.toThrow(
      "Request timeout",
    );
  });

  it("handles 404 error", async () => {
    const notFoundError = new Error("Not Found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (notFoundError as any).response = { status: 404 };
    (axios.get as jest.Mock).mockRejectedValue(notFoundError);

    await expect(getPersonalClassSchedule(1, 2024)).rejects.toThrow(
      "Not Found",
    );
  });

  it("handles 500 server error", async () => {
    const serverError = new Error("Internal Server Error");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (serverError as any).response = { status: 500 };
    (axios.get as jest.Mock).mockRejectedValue(serverError);

    await expect(getPersonalClassSchedule(1, 2024)).rejects.toThrow(
      "Internal Server Error",
    );
  });
});
