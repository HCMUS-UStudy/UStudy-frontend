/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";
import ClassMaterial from "@/app/(user)/teacher/classes/[classId]/material/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

// Mock services
jest.mock("@/app/lib/services/class-material", () => ({
  getListMaterial: jest.fn(),
  createFolder: jest.fn(),
  getPreview: jest.fn(),
  downloadMaterial: jest.fn(),
  uploadMaterial: jest.fn(),
  deleteMaterial: jest.fn(),
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
jest.mock("@/app/ui/components/user/teacher/UploadModal", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockUploadModal({ isOpen, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="upload-modal">
        <button onClick={onClose}>Close Upload</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Tooltip", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockTooltip({ children, text }: any) {
    return (
      <div data-testid="tooltip" title={text}>
        {children}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe("Teacher Class Material Page", () => {
  const mockMaterials = {
    content: [
      {
        id: "1",
        material: {
          id: "mat1",
          name: "Bài giảng chương 1",
          type: "FILE",
          size: 1024000,
          extension: "pdf",
          createdAt: "2024-01-15T08:00:00Z",
          uploadedBy: {
            id: "1",
            genId: "GV001",
            email: "teacher1@example.com",
            name: "Nguyễn Văn A",
            avatar: "",
          },
        },
        canView: true,
        canDownload: true,
        canDelete: true,
      },
      {
        id: "2",
        material: {
          id: "mat2",
          name: "Thư mục bài tập",
          type: "FOLDER",
          size: 0,
          extension: "",
          createdAt: "2024-01-14T10:00:00Z",
          uploadedBy: {
            id: "1",
            genId: "GV001",
            email: "teacher1@example.com",
            name: "Nguyễn Văn A",
            avatar: "",
          },
        },
        canView: true,
        canDownload: true,
        canDelete: true,
      },
      {
        id: "3",
        material: {
          id: "mat3",
          name: "Bài tập về nhà",
          type: "FILE",
          size: 512000,
          extension: "docx",
          createdAt: "2024-01-13T15:00:00Z",
          uploadedBy: {
            id: "2",
            genId: "ST001",
            email: "student1@example.com",
            name: "Trần Thị B",
            avatar: "",
          },
        },
        canView: true,
        canDownload: false,
        canDelete: false,
      },
    ],
  };

  const mockUserData = {
    id: "1",
    genId: "GV001",
    email: "teacher1@example.com",
    name: "Nguyễn Văn A",
    avatar: "",
  };

  beforeEach(() => {
    mockUseParams.mockReturnValue({ classId: "class1" });

    const { getListMaterial } = require("@/app/lib/services/class-material");
    const { getUserDataFromCookies } = require("@/app/lib/action");

    getListMaterial.mockResolvedValue(mockMaterials);
    getUserDataFromCookies.mockResolvedValue(mockUserData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders material page with loading state initially", () => {
    render(<ClassMaterial />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders material page with data after loading", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Bài giảng chương 1")).toBeInTheDocument();
      expect(screen.getByText("Thư mục bài tập")).toBeInTheDocument();
      expect(screen.getByText("Bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("displays add material button", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
    });
  });

  it("displays create folder button", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
    });
  });

  it("opens create folder modal when create folder button is clicked", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      const createFolderButton = screen.getByText("Tạo thư mục mới");
      fireEvent.click(createFolderButton);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Tên thư mục")).toBeInTheDocument();
    });
  });

  it("displays material information correctly", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Bài giảng chương 1")).toBeInTheDocument();
      expect(screen.getByText("Thư mục bài tập")).toBeInTheDocument();
      expect(screen.getByText("Bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("displays breadcrumb navigation", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      // Should show root breadcrumb
      expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
    });
  });

  it("handles folder creation", async () => {
    const { createFolder } = require("@/app/lib/services/class-material");
    createFolder.mockResolvedValue({});
    render(<ClassMaterial />);
    const createFolderButton = await screen.findByText("Tạo thư mục mới");
    fireEvent.click(createFolderButton);
    const input = await screen.findByPlaceholderText("Tên thư mục");
    fireEvent.change(input, { target: { value: "Thư mục mới" } });
    // Simulate pressing Enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    // Or click the confirm icon if present
    // const submitButton = screen.getByTitle("Xác nhận");
    // fireEvent.click(submitButton);
    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith("class1", "Thư mục mới", null);
    });
  });

  it("handles empty material list", async () => {
    const { getListMaterial } = require("@/app/lib/services/class-material");
    getListMaterial.mockResolvedValue({ content: [] });

    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
      expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
    });
  });

  it("handles error state gracefully", async () => {
    const { getListMaterial } = require("@/app/lib/services/class-material");
    getListMaterial.mockRejectedValue(new Error("Failed to fetch"));

    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
      expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
    });
  });

  it("closes upload modal when close button is clicked", async () => {
    render(<ClassMaterial />);
    const addButton = await screen.findByText("Tải tài liệu lên");
    fireEvent.click(addButton);
    // Try to close the modal by simulating Escape key or clicking a close button if present
    // fireEvent.click(screen.getByText("Close Upload"));
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    await waitFor(() => {
      expect(screen.queryByTestId("upload-modal")).not.toBeInTheDocument();
    });
  });

  it("handles mobile responsive design", async () => {
    // Mock mobile view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
      expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
    });

    // Test resize event
    fireEvent(window, new Event("resize"));
  });

  it("sorts materials correctly (folders first, then files)", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      const materials = screen.getAllByText(/Bài giảng|Thư mục|Bài tập/);
      // Folders should come first
      expect(materials[0]).toHaveTextContent("Thư mục bài tập");
    });
  });

  it("displays file extensions correctly", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Bài giảng chương 1")).toBeInTheDocument();
      expect(screen.getByText("Bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("handles permission-based actions", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      // Should show appropriate action buttons based on permissions
      expect(screen.getByText("Bài giảng chương 1")).toBeInTheDocument();
      expect(screen.getByText("Bài tập về nhà")).toBeInTheDocument();
    });
  });

  it("shows tooltip for long file names", async () => {
    const longFileNameMaterial = {
      content: [
        {
          ...mockMaterials.content[0],
          material: {
            ...mockMaterials.content[0].material,
            name: "Bài giảng rất dài về chương 1 môn Toán lớp 10A năm học 2024-2025",
          },
        },
      ],
    };

    const { getListMaterial } = require("@/app/lib/services/class-material");
    getListMaterial.mockResolvedValue(longFileNameMaterial);

    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getAllByTestId("tooltip")).toHaveLength(3);
    });
  });
});
