import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassMaterial from "@/app/(admin)/admin/classes/[classId]/material/page";
import * as classMaterialService from "@/app/lib/services/class-material";
import * as action from "@/app/lib/action";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useParams: () => ({
    classId: "encoded-class-id",
  }),
}));

jest.mock("@/app/lib/hooks/useEncodedRoute", () => ({
  useEncodedRoute: () => ({
    decodeId: jest.fn(() => "decoded-class-id"),
  }),
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({ addToast: mockToast }),
}));

jest.mock("@/app/lib/services/class-material");
jest.mock("@/app/lib/action");
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) {
    return <div data-testid={`tooltip-${text}`}>{children}</div>;
  };
});

// Mock các icon components
jest.mock("react-icons/tb", () => ({
  TbFolders: () => <div data-testid="folder-icon">📁</div>,
  TbFileTypePdf: () => <div data-testid="pdf-icon">📄</div>,
  TbFileTypeDoc: () => <div data-testid="doc-icon">📝</div>,
  TbFileTypeDocx: () => <div data-testid="docx-icon">📝</div>,
  TbFileTypePpt: () => <div data-testid="ppt-icon">📊</div>,
  TbFileTypeTxt: () => <div data-testid="txt-icon">📄</div>,
  TbFileTypeZip: () => <div data-testid="zip-icon">📦</div>,
  TbFileTypePng: () => <div data-testid="png-icon">🖼️</div>,
  TbFileTypeJpg: () => <div data-testid="jpg-icon">🖼️</div>,
}));

jest.mock("react-icons/fi", () => ({
  FiEdit3: () => <div data-testid="edit-icon">✏️</div>,
}));

jest.mock("react-icons/md", () => ({
  MdOutlineFileDownload: () => <div data-testid="download-icon">⬇️</div>,
  MdOutlineArrowForwardIos: () => <div data-testid="arrow-icon">→</div>,
}));

jest.mock("react-icons/gr", () => ({
  GrView: () => <div data-testid="view-icon">👁️</div>,
}));

jest.mock("react-icons/rx", () => ({
  RxCross2: () => <div data-testid="cross-icon">✕</div>,
}));

jest.mock("react-icons/lu", () => ({
  LuTrash2: () => <div data-testid="trash-icon">🗑️</div>,
}));

const mockMaterials = {
  content: [
    {
      id: "1",
      material: {
        id: "mat1",
        name: "Document.pdf",
        type: "FILE",
        uploadDate: "2024-01-01T10:00:00Z",
        uploadedBy: {
          genId: "user1",
          name: "User 1",
        },
      },
    },
    {
      id: "2",
      material: {
        id: "mat2",
        name: "Folder 1",
        type: "FOLDER",
        uploadDate: "2024-01-02T10:00:00Z",
        uploadedBy: {
          genId: "user2",
          name: "User 2",
        },
      },
    },
    {
      id: "3",
      material: {
        id: "mat3",
        name: "Image.jpg",
        type: "FILE",
        uploadDate: "2024-01-03T10:00:00Z",
        uploadedBy: {
          genId: "user1",
          name: "User 1",
        },
      },
    },
  ],
};

const mockUserData = {
  genId: "user1",
  name: "User 1",
  avatar: "/avatar1.jpg",
};

describe("ClassMaterial Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.success.mockReset();
    mockToast.error.mockReset();
    mockToast.info.mockReset();
    (action.getUserDataFromCookies as jest.Mock).mockResolvedValue(
      mockUserData,
    );
    (classMaterialService.getListMaterial as jest.Mock).mockResolvedValue(
      mockMaterials,
    );
  });

  it("should render loading state initially", async () => {
    (classMaterialService.getListMaterial as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<ClassMaterial />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render materials list after loading", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Image.jpg")).toBeInTheDocument();
    });

    expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
  });

  it("should show breadcrumb when navigating to folder", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
    });

    // Double click to enter folder
    const folderElement = screen.getByText("Folder 1");
    fireEvent.doubleClick(folderElement);

    await waitFor(() => {
      expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
    });
  });

  it("should handle file selection", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });

    const fileElement = screen.getByText("Document.pdf");
    fireEvent.click(fileElement);

    // Should show active file toolbar
    expect(screen.getByTestId("tooltip-Hủy chọn")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-Xem")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-Tải xuống")).toBeInTheDocument();
  });

  it("should handle file download", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    (classMaterialService.downloadMaterial as jest.Mock).mockResolvedValue(
      mockBlob,
    );
    const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
    window.URL.createObjectURL = mockCreateObjectURL;

    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    const fileElement = screen.getByText("Document.pdf");
    fireEvent.click(fileElement);
    // Click vào icon tải xuống (nằm trong tooltip)
    const downloadButton = screen
      .getByTestId("tooltip-Tải xuống")
      .querySelector(".cursor-pointer");
    fireEvent.click(downloadButton!);
    await waitFor(() => {
      expect(classMaterialService.downloadMaterial).toHaveBeenCalledWith("1");
    });
  });

  it("should handle file view", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    (classMaterialService.getPreview as jest.Mock).mockResolvedValue(mockBlob);
    const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
    window.URL.createObjectURL = mockCreateObjectURL;

    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    const fileElement = screen.getByText("Document.pdf");
    fireEvent.click(fileElement);
    // Click vào icon xem (nằm trong tooltip)
    const viewButton = screen
      .getByTestId("tooltip-Xem")
      .querySelector(".cursor-pointer");
    fireEvent.click(viewButton!);
    await waitFor(() => {
      expect(classMaterialService.getPreview).toHaveBeenCalledWith("mat1");
    });
  });

  it("should show options menu for user's files", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });

    // Find the options button (⋮)
    const optionsButtons = screen.getAllByText("⋮");
    fireEvent.click(optionsButtons[0]);

    expect(screen.getByText("Tải xuống")).toBeInTheDocument();
    expect(screen.getByText("Đổi tên")).toBeInTheDocument();
    expect(screen.getByText("Xóa")).toBeInTheDocument();
  });

  it("should handle delete confirmation", async () => {
    (classMaterialService.deleteMaterial as jest.Mock).mockResolvedValue(
      undefined,
    );
    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    // Mở menu tuỳ chọn
    const optionsButtons = screen.getAllByText("⋮");
    fireEvent.click(optionsButtons[0]);
    // Click Xóa
    fireEvent.click(screen.getByText("Xóa"));
    // Click xác nhận Xóa
    const confirmDeleteButton = screen
      .getByText("Xác nhận xóa")
      .parentElement?.parentElement?.querySelector("button:last-child");
    fireEvent.click(confirmDeleteButton!);
    await waitFor(() => {
      expect(classMaterialService.deleteMaterial).toHaveBeenCalledWith(
        "decoded-class-id",
        "1",
      );
      expect(mockToast.success).toHaveBeenCalledWith("Xóa tài liệu thành công");
    });
  });

  it("should handle delete error", async () => {
    (classMaterialService.deleteMaterial as jest.Mock).mockRejectedValue(
      new Error("Delete failed"),
    );
    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    // Mở menu tuỳ chọn
    const optionsButtons = screen.getAllByText("⋮");
    fireEvent.click(optionsButtons[0]);
    // Click Xóa
    fireEvent.click(screen.getByText("Xóa"));
    // Click xác nhận Xóa
    const confirmDeleteButton = screen
      .getByText("Xác nhận xóa")
      .parentElement?.parentElement?.querySelector("button:last-child");
    fireEvent.click(confirmDeleteButton!);
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Xóa tài liệu thất bại");
    });
  });

  it("should handle rename functionality", async () => {
    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    // Mở menu tuỳ chọn
    const optionsButtons = screen.getAllByText("⋮");
    fireEvent.click(optionsButtons[0]);
    // Click Đổi tên
    fireEvent.click(screen.getByText("Đổi tên"));
    await waitFor(() => {
      expect(mockToast.info).toHaveBeenCalledWith(
        "Chức năng đổi tên chưa được cài đặt",
      );
    });
  });

  it("should show empty state when no materials", async () => {
    (classMaterialService.getListMaterial as jest.Mock).mockResolvedValue({
      content: [],
    });

    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Không có tài liệu nào.")).toBeInTheDocument();
    });
  });

  it("should handle breadcrumb navigation", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
    });

    // Enter folder
    const folderElement = screen.getByText("Folder 1");
    fireEvent.doubleClick(folderElement);

    await waitFor(() => {
      expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
    });

    // Click on breadcrumb to go back
    const breadcrumbLink = screen.getByText("Tất cả tài liệu");
    fireEvent.click(breadcrumbLink);

    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
  });

  it("should handle cancel selection", async () => {
    render(<ClassMaterial />);
    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    });
    const fileElement = screen.getByText("Document.pdf");
    fireEvent.click(fileElement);
    // Click cancel
    const cancelButton = screen
      .getByTestId("tooltip-Hủy chọn")
      .querySelector(".cursor-pointer");
    fireEvent.click(cancelButton!);
    await waitFor(() => {
      expect(screen.queryByTestId("tooltip-Hủy chọn")).not.toBeInTheDocument();
    });
  });

  it("should show file type icons correctly", async () => {
    render(<ClassMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Document.pdf")).toBeInTheDocument();
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Image.jpg")).toBeInTheDocument();
    });

    // Check if icons are rendered
    expect(screen.getByTestId("folder-icon")).toBeInTheDocument();
    expect(screen.getByTestId("pdf-icon")).toBeInTheDocument();
    expect(screen.getByTestId("jpg-icon")).toBeInTheDocument();
  });
});
