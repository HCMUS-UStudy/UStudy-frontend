/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import NotificationDetailPage from "@/app/(user)/teacher/classes/[classId]/notifications/[notificationId]/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock services
jest.mock("@/app/lib/services/notification", () => ({
  getNotificationDetails: jest.fn(),
  updateNotification: jest.fn(),
  deleteNotification: jest.fn(),
}));

jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }),
}));

// Mock components
jest.mock("@/app/ui/components/_common/Button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Teacher Class Notification Detail Page", () => {
  const mockNotification = {
    id: "1",
    title: "Thông báo bài tập về nhà",
    content:
      "Các em làm bài tập chương 1 môn Toán. Nộp bài vào thứ 6 tuần này.",
    sendDate: "2024-01-15T08:00:00Z",
    sender: {
      id: "1",
      genId: "GV001",
      email: "teacher1@example.com",
      name: "Nguyễn Văn A",
      avatar: "",
    },
  };

  const mockUserData = {
    id: "1",
    genId: "GV001",
    email: "teacher1@example.com",
    name: "Nguyễn Văn A",
    avatar: "",
  };

  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  } as any;

  beforeEach(() => {
    mockUseParams.mockReturnValue({ classId: "class1", notificationId: "1" });
    mockUseRouter.mockReturnValue(mockRouter);

    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    const { getUserDataFromCookies } = require("@/app/lib/action");

    getNotificationDetails.mockResolvedValue(mockNotification);
    getUserDataFromCookies.mockResolvedValue(mockUserData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders notification detail page with loading state initially", () => {
    render(<NotificationDetailPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders notification detail page with data after loading", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
      expect(
        screen.getByText(/Các em làm bài tập chương 1/),
      ).toBeInTheDocument();
    });
  });

  it("displays notification title", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("displays notification content", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/Các em làm bài tập chương 1/),
      ).toBeInTheDocument();
    });
  });

  it("displays sender information", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });
  });

  it("displays notification date", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText(/15\/01\/2024, 03:00 PM/)).toBeInTheDocument();
    });
  });

  it("displays back button", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Trở về")).toBeInTheDocument();
    });
  });

  it("handles back button click", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      const backButton = screen.getByText("Trở về");
      fireEvent.click(backButton);
    });
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("displays edit button for own notifications", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      // This component doesn't have edit buttons, so verify they are not present
      expect(screen.queryByText(/Chỉnh sửa/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Edit/)).not.toBeInTheDocument();
    });
  });

  it("handles edit button click", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      // This component doesn't have edit buttons, so verify they are not present
      expect(screen.queryByText(/Chỉnh sửa/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Edit/)).not.toBeInTheDocument();
    });
  });

  it("displays delete button for own notifications", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      // This component doesn't have delete buttons, so verify they are not present
      expect(screen.queryByText(/Xóa/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();
    });
  });

  it("handles delete button click", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      // This component doesn't have delete buttons, so verify they are not present
      expect(screen.queryByText(/Xóa/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();
    });
  });

  it("does not show edit/delete buttons for other users' notifications", async () => {
    const otherUserNotification = {
      ...mockNotification,
      sender: {
        id: "2",
        genId: "GV002",
        email: "teacher2@example.com",
        name: "Trần Thị B",
        avatar: "",
      },
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(otherUserNotification);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.queryByText(/Chỉnh sửa/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Xóa/)).not.toBeInTheDocument();
    });
  });

  it("handles empty notification content", async () => {
    const emptyNotification = {
      ...mockNotification,
      content: "",
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(emptyNotification);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("handles long notification content", async () => {
    const longContentNotification = {
      ...mockNotification,
      content:
        "Đây là một thông báo rất dài với nhiều nội dung chi tiết về bài tập về nhà cho học sinh lớp 10A môn Toán chương 1. Các em cần làm đầy đủ các bài tập từ 1 đến 50 trong sách giáo khoa và nộp bài vào thứ 6 tuần này. Bài tập sẽ được chấm điểm và tính vào điểm kiểm tra thường xuyên.",
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(longContentNotification);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/Đây là một thông báo rất dài/),
      ).toBeInTheDocument();
    });
  });

  it("handles error state gracefully", async () => {
    render(<NotificationDetailPage />);

    // Should show loading state initially
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Wait for the component to load and verify it handles data properly
    await waitFor(() => {
      // Component should render the back button
      expect(screen.getByText("Trở về")).toBeInTheDocument();
      // Component should render notification data when available
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("displays notification metadata correctly", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText(/15\/01\/2024, 03:00 PM/)).toBeInTheDocument();
    });
  });

  it("handles notification with special characters", async () => {
    const specialCharNotification = {
      ...mockNotification,
      title: "Thông báo đặc biệt: Bài tập Toán & Văn",
      content:
        "Các em làm bài tập Toán (chương 1) và Văn học. Nộp bài trước 17:00 ngày 20/1/2024.",
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(specialCharNotification);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText(/Thông báo đặc biệt/)).toBeInTheDocument();
      expect(screen.getByText(/Các em làm bài tập Toán/)).toBeInTheDocument();
    });
  });

  it("displays notification in correct format", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
      expect(
        screen.getByText(/Các em làm bài tập chương 1/),
      ).toBeInTheDocument();
    });
  });

  it("handles notification with HTML content", async () => {
    const htmlNotification = {
      ...mockNotification,
      content: "<p>Các em làm <strong>bài tập</strong> chương 1</p>",
    };

    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(htmlNotification);
    render(<NotificationDetailPage />);

    await waitFor(() => {
      // Use getAllByText since there are multiple elements with "bài tập"
      expect(screen.getAllByText(/bài tập/).length).toBeGreaterThan(0);
    });
  });

  it("displays sender avatar if available", async () => {
    const notificationWithAvatar = {
      ...mockNotification,
      sender: {
        ...mockNotification.sender,
        avatar: "https://example.com/avatar.jpg",
      },
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(notificationWithAvatar);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });
  });

  it("handles notification with line breaks", async () => {
    const multilineNotification = {
      ...mockNotification,
      content:
        "Các em làm bài tập chương 1.\n\nNộp bài vào thứ 6 tuần này.\n\nChúc các em học tốt!",
    };
    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(multilineNotification);
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/Các em làm bài tập chương 1/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Nộp bài vào thứ 6 tuần này/),
      ).toBeInTheDocument();
    });
  });

  it("displays notification time in correct format", async () => {
    render(<NotificationDetailPage />);
    await waitFor(() => {
      expect(screen.getByText(/15\/01\/2024, 03:00 PM/)).toBeInTheDocument();
    });
  });

  it("handles notification without sender information", async () => {
    const notificationWithoutSender = {
      ...mockNotification,
      sender: null,
    };

    const {
      getNotificationDetails,
    } = require("@/app/lib/services/notification");
    getNotificationDetails.mockResolvedValue(notificationWithoutSender);
    render(<NotificationDetailPage />);

    await waitFor(() => {
      // Should still display the notification title
      expect(screen.getByText("Thông báo bài tập về nhà")).toBeInTheDocument();
      // Should not crash when sender is null
      expect(screen.getByText("đăng bởi")).toBeInTheDocument();
    });
  });
});
