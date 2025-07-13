import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import PersonalMaterial from "@/app/(user)/teacher/personal-material/page";

// Mock the personal-material service
jest.mock("@/app/lib/services/personal-material", () => ({
  getListMaterial: jest.fn(),
  createFolder: jest.fn(),
  uploadMaterial: jest.fn(),
  deleteMaterial: jest.fn(),
  downloadMaterial: jest.fn(),
  getPreview: jest.fn(),
}));

// Mock the UploadModal component
jest.mock("@/app/ui/components/user/teacher/UploadModal", () => {
  return function MockUploadModal({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="upload-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

// Mock the Loading component
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

// Mock the Tooltip component
jest.mock("@/app/ui/components/_common/Tooltip", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockTooltip({ children, text }: any) {
    return <div data-testid={`tooltip-${text}`}>{children}</div>;
  };
});

// Mock the toast hook
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    },
  }),
}));

// Mock react-icons
jest.mock("react-icons/io", () => ({
  IoIosAdd: () => <span>+</span>,
}));

jest.mock("react-icons/pi", () => ({
  PiFolderPlus: () => <span>📁</span>,
}));

jest.mock("react-icons/tb", () => ({
  TbFolders: () => <span>📁</span>,
  TbFileTypeDoc: () => <span>📄</span>,
  TbFileTypeDocx: () => <span>📄</span>,
  TbFileTypePdf: () => <span>📄</span>,
  TbFileTypePpt: () => <span>📄</span>,
  TbFileTypeTxt: () => <span>📄</span>,
  TbFileTypeZip: () => <span>📄</span>,
  TbFileTypePng: () => <span>📄</span>,
  TbFileTypeJpg: () => <span>📄</span>,
}));

jest.mock("react-icons/fi", () => ({
  FiEdit3: () => <span>✏️</span>,
}));

jest.mock("react-icons/md", () => ({
  MdOutlineFileDownload: () => <span>📥</span>,
  MdOutlineArrowForwardIos: () => <span>→</span>,
}));

jest.mock("react-icons/gr", () => ({
  GrView: () => <span>👁️</span>,
}));

jest.mock("react-icons/rx", () => ({
  RxCross2: () => <span>✕</span>,
}));

jest.mock("react-icons/lu", () => ({
  LuTrash2: () => <span>🗑️</span>,
}));

jest.mock("react-icons/fa", () => ({
  FaCheck: () => <span>✓</span>,
  FaTimes: () => <span>✕</span>,
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("PersonalMaterial Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful API response
    const mockGetListMaterial =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/personal-material").getListMaterial;
    mockGetListMaterial.mockResolvedValue({
      content: [
        {
          id: "1",
          material: {
            id: "mat1",
            name: "document.pdf",
            uploadedBy: { name: "Teacher Name" },
            type: "FILE",
            uploadDate: "2024-01-01T00:00:00Z",
            filePath: "/path/to/file",
          },
          lastModified: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          material: {
            id: "mat2",
            name: "Folder 1",
            uploadedBy: { name: "Teacher Name" },
            type: "FOLDER",
            uploadDate: "2024-01-01T00:00:00Z",
            filePath: "/path/to/folder",
          },
          lastModified: "2024-01-01T00:00:00Z",
        },
      ],
    });
  });

  it("renders loading state initially", () => {
    renderWithQueryClient(<PersonalMaterial />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders upload and create folder buttons", async () => {
    renderWithQueryClient(<PersonalMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
      expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
    });
  });

  it("renders breadcrumb with 'Tất cả tài liệu' when no folder is selected", async () => {
    renderWithQueryClient(<PersonalMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
    });
  });

  it("renders material items after loading", async () => {
    renderWithQueryClient(<PersonalMaterial />);

    await waitFor(() => {
      expect(screen.getByText("document.pdf")).toBeInTheDocument();
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
    });
  });

  it("shows empty state when no materials exist", async () => {
    const mockGetListMaterial =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/personal-material").getListMaterial;
    mockGetListMaterial.mockResolvedValueOnce({ content: [] });

    renderWithQueryClient(<PersonalMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Không có tài liệu nào.")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const mockGetListMaterial =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/app/lib/services/personal-material").getListMaterial;
    mockGetListMaterial.mockRejectedValueOnce(new Error("API Error"));

    renderWithQueryClient(<PersonalMaterial />);

    await waitFor(() => {
      expect(screen.getByText("Không có tài liệu nào.")).toBeInTheDocument();
    });
  });
});
