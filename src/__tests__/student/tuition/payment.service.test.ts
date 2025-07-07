import { getPaymentByStuId } from "@/app/lib/services/payment";

// Mock the axios instance
jest.mock("@/app/lib/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// Import the mocked axios instance
import axiosInstance from "@/app/lib/axios";
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls getPaymentByStuId with correct parameters", async () => {
    const mockResponse = {
      data: {
        data: {
          content: [
            {
              id: "1",
              amount: 1000000,
              status: "PENDING",
              dueDate: "2024-01-15",
              description: "Học phí tháng 1",
            },
          ],
          totalPages: 3,
          totalElements: 6,
        },
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getPaymentByStuId("student123", 0, 5, "PENDING");

    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/payment/list", {
      params: {
        studentId: "student123",
        page: 0,
        limit: 5,
        status: "PENDING",
      },
    });
    expect(result).toEqual(mockResponse.data.data);
  });

  it("calls API with different parameters", async () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          totalPages: 0,
          totalElements: 0,
        },
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await getPaymentByStuId("student456", 1, 10, "COMPLETED");

    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/payment/list", {
      params: {
        studentId: "student456",
        page: 1,
        limit: 10,
        status: "COMPLETED",
      },
    });
  });

  it("handles API errors correctly", async () => {
    const errorMessage = "Payment service error";
    mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

    const result = await getPaymentByStuId("student123", 0, 5, "");

    expect(result).toEqual({
      content: [],
      totalElements: 0,
      totalPages: 0,
    });
  });

  it("calls API without status filter when status is empty", async () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          totalPages: 0,
          totalElements: 0,
        },
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await getPaymentByStuId("student123", 0, 5, "");

    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/payment/list", {
      params: {
        studentId: "student123",
        page: 0,
        limit: 5,
        status: "",
      },
    });
  });

  it("calls API with undefined studentId", async () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          totalPages: 0,
          totalElements: 0,
        },
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await getPaymentByStuId(undefined, 0, 5, "");

    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/payment/list", {
      params: {
        studentId: "",
        page: 0,
        limit: 5,
        status: "",
      },
    });
  });

  it("returns correct data structure", async () => {
    const mockResponse = {
      data: {
        data: {
          content: [
            {
              id: "1",
              amount: 1000000,
              status: "PENDING",
              dueDate: "2024-01-15",
              description: "Học phí tháng 1",
            },
            {
              id: "2",
              amount: 2000000,
              status: "COMPLETED",
              dueDate: "2024-01-10",
              description: "Học phí tháng 12",
            },
          ],
          totalPages: 2,
          totalElements: 4,
        },
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getPaymentByStuId("student123", 0, 5, "");

    expect(result).toEqual(mockResponse.data.data);
    expect(result.content).toHaveLength(2);
    expect(result.totalPages).toBe(2);
    expect(result.totalElements).toBe(4);
  });
});
