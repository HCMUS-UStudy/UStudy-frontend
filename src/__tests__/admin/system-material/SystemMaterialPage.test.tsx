import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SystemMaterial from "@/app/(admin)/admin/system-material/page";
import * as systemMaterialService from "@/app/lib/services/system-material";
import * as gradeService from "@/app/lib/services/grade";
import * as courseService from "@/app/lib/services/course";
import * as action from "@/app/lib/action";

// Mock useQueries
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueries: jest.fn(),
}));

// Mock the services
jest.mock("@/app/lib/services/system-material");
jest.mock("@/app/lib/services/grade");
jest.mock("@/app/lib/services/course");
jest.mock("@/app/lib/action");
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      info: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
    },
  }),
}));

// Mock the UploadModal component
jest.mock("@/app/ui/components/user/teacher/UploadModal", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockUploadModal({ onClose, onUpload }: any) {
    return (
      <div data-testid="upload-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onUpload(new File([], "test.pdf"))}>
          Upload
        </button>
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
    return <div title={text}>{children}</div>;
  };
});

// Mock icons
jest.mock("react-icons/io", () => ({
  IoIosAdd: () => <div data-testid="add-icon">Add</div>,
}));

jest.mock("react-icons/pi", () => ({
  PiFolderPlus: () => <div data-testid="folder-plus-icon">Folder Plus</div>,
}));

jest.mock("react-icons/tb", () => ({
  TbFolders: () => <div data-testid="folders-icon">Folders</div>,
  TbFileTypeDoc: () => <div data-testid="doc-icon">Doc</div>,
  TbFileTypeDocx: () => <div data-testid="docx-icon">Docx</div>,
  TbFileTypePdf: () => <div data-testid="pdf-icon">Pdf</div>,
  TbFileTypePpt: () => <div data-testid="ppt-icon">Ppt</div>,
  TbFileTypeTxt: () => <div data-testid="txt-icon">Txt</div>,
  TbFileTypeZip: () => <div data-testid="zip-icon">Zip</div>,
  TbFileTypePng: () => <div data-testid="png-icon">Png</div>,
  TbFileTypeJpg: () => <div data-testid="jpg-icon">Jpg</div>,
}));

jest.mock("react-icons/fi", () => ({
  FiEdit3: () => <div data-testid="edit-icon">Edit</div>,
}));

jest.mock("react-icons/md", () => ({
  MdOutlineFileDownload: () => <div data-testid="download-icon">Download</div>,
  MdOutlineArrowForwardIos: () => <div data-testid="arrow-icon">Arrow</div>,
}));

jest.mock("react-icons/gr", () => ({
  GrView: () => <div data-testid="view-icon">View</div>,
}));

jest.mock("react-icons/rx", () => ({
  RxCross2: () => <div data-testid="cross-icon">Cross</div>,
}));

jest.mock("react-icons/lu", () => ({
  LuTrash2: () => <div data-testid="trash-icon">Trash</div>,
}));

jest.mock("react-icons/fa", () => ({
  FaCheck: () => <div data-testid="check-icon">Check</div>,
  FaTimes: () => <div data-testid="times-icon">Times</div>,
}));

const mockGrades = {
  content: [
    { id: "grade1", name: "Grade 1" },
    { id: "grade2", name: "Grade 2" },
  ],
};

const mockCourses = {
  content: [
    { id: "course1", name: "Course 1" },
    { id: "course2", name: "Course 2" },
  ],
};

const mockMaterials = {
  content: [
    {
      id: "material1",
      material: {
        id: "mat1",
        name: "test.pdf",
        type: "FILE",
        uploadDate: "2024-01-01T00:00:00Z",
        uploadedBy: {
          genId: "user1",
          name: "Test User",
        },
      },
    },
    {
      id: "material2",
      material: {
        id: "mat2",
        name: "test-folder",
        type: "FOLDER",
        uploadDate: "2024-01-01T00:00:00Z",
        uploadedBy: {
          genId: "user1",
          name: "Test User",
        },
      },
    },
  ],
};

const mockUser = {
  genId: "user1",
  name: "Test User",
};

describe("SystemMaterial Page", () => {
  let queryClient: QueryClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseQueries = require("@tanstack/react-query").useQueries;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock useQueries to return proper query objects
    mockUseQueries.mockReturnValue([
      {
        data: mockGrades,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      },
      {
        data: mockCourses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        isFetching: false,
      },
    ]);

    // Mock service functions
    (gradeService.getAllGrades as jest.Mock).mockResolvedValue(mockGrades);
    (courseService.getCoursesByGradeId as jest.Mock).mockResolvedValue(
      mockCourses,
    );
    (systemMaterialService.getListByCourseGrade as jest.Mock).mockResolvedValue(
      mockMaterials,
    );
    (systemMaterialService.getListMaterial as jest.Mock).mockResolvedValue(
      mockMaterials,
    );
    (action.getUserDataFromCookies as jest.Mock).mockResolvedValue(mockUser);

    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSystemMaterial = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SystemMaterial />
      </QueryClientProvider>,
    );
  };

  it("renders the system material page", async () => {
    renderSystemMaterial();

    await waitFor(() => {
      expect(screen.getByText("Tất cả tài liệu")).toBeInTheDocument();
    });
  });

  it("displays grade and course selectors", async () => {
    renderSystemMaterial();
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Grade 1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Course 1" }),
      ).toBeInTheDocument();
    });
  });

  it("shows upload and create folder buttons when course and grade are selected", async () => {
    renderSystemMaterial();

    // Wait for the component to load and automatically select grade and course
    await waitFor(
      () => {
        // Check if grade and course are selected
        const comboboxes = screen.getAllByRole("combobox");
        const gradeSelect = comboboxes[0];
        const courseSelect = comboboxes[1];

        expect(gradeSelect).toHaveValue("grade1");
        expect(courseSelect).toHaveValue("course1");
      },
      { timeout: 3000 },
    );

    // Now check if the buttons are rendered
    await waitFor(
      () => {
        expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
        expect(screen.getByText("Tạo thư mục mới")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("displays materials list", async () => {
    renderSystemMaterial();

    // Wait for the component to load and fetch materials
    await waitFor(
      () => {
        expect(screen.getAllByText("test.pdf").length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    expect(screen.getAllByText("test-folder").length).toBeGreaterThan(0);
  });

  it("shows empty state when no materials", async () => {
    (systemMaterialService.getListByCourseGrade as jest.Mock).mockResolvedValue(
      { content: [] },
    );

    renderSystemMaterial();

    await waitFor(() => {
      expect(screen.queryByText("Không có tài liệu nào.")).toBeInTheDocument();
    });
  });

  it("opens upload modal when upload button is clicked", async () => {
    renderSystemMaterial();

    await waitFor(
      () => {
        const uploadButton = screen.getByText("Tải tài liệu lên");
        fireEvent.click(uploadButton);
      },
      { timeout: 3000 },
    );

    expect(screen.queryByTestId("upload-modal")).toBeInTheDocument();
  });

  it("handles grade selection change", async () => {
    let currentGradeId = "grade1";
    mockUseQueries.mockImplementation(() => [
      {
        data: mockGrades,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      },
      {
        data:
          currentGradeId === "grade2"
            ? { content: [{ id: "course3", name: "Course 3" }] }
            : mockCourses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        isFetching: false,
      },
    ]);

    renderSystemMaterial();

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Grade 1" }),
      ).toBeInTheDocument();
    });

    const gradeSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(gradeSelect, { target: { value: "grade2" } });
    currentGradeId = "grade2";

    // Force re-render to simulate state update
    renderSystemMaterial();

    // Wait for the course dropdown to update
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Course 3" }),
      ).toBeInTheDocument();
    });
  });

  it("handles course selection change", async () => {
    renderSystemMaterial();

    await waitFor(() => {
      const courseOption = screen.getByRole("option", { name: "Course 1" });
      expect(courseOption).toBeInTheDocument();
      const courseSelect = courseOption.closest("select");
      fireEvent.change(courseSelect!, { target: { value: "course2" } });
    });

    expect(systemMaterialService.getListByCourseGrade).toHaveBeenCalledWith(
      "course2",
      "grade1",
    );
  });

  it("shows file options when file is clicked", async () => {
    renderSystemMaterial();

    await waitFor(
      () => {
        const fileItem = screen.getByText("test.pdf");
        fireEvent.click(fileItem);
      },
      { timeout: 3000 },
    );

    expect(screen.getAllByText("⋮").length).toBeGreaterThan(0);
  });

  it("handles folder creation", async () => {
    (systemMaterialService.createFolder as jest.Mock).mockResolvedValue({
      success: true,
    });

    renderSystemMaterial();

    await waitFor(
      () => {
        const createFolderButton = screen.getByText("Tạo thư mục mới");
        fireEvent.click(createFolderButton);
      },
      { timeout: 3000 },
    );

    // Check if folder creation input appears
    expect(screen.queryByPlaceholderText("Tên thư mục")).toBeInTheDocument();
  });

  it("handles file download", async () => {
    (systemMaterialService.downloadMaterial as jest.Mock).mockResolvedValue(
      new Blob(),
    );

    renderSystemMaterial();

    await waitFor(
      () => {
        const fileItem = screen.getByText("test.pdf");
        fireEvent.click(fileItem);
      },
      { timeout: 3000 },
    );

    // Find and click download button in options menu
    await waitFor(() => {
      const optionsButtons = screen.getAllByText("⋮");
      // Click the second one (for the PDF file)
      fireEvent.click(optionsButtons[1]);
    });

    await waitFor(() => {
      const downloadButton = screen.getByText("Tải xuống");
      fireEvent.click(downloadButton);
    });

    expect(systemMaterialService.downloadMaterial).toHaveBeenCalledWith(
      "material1",
    );
  });

  it("handles file deletion", async () => {
    (systemMaterialService.deleteMaterial as jest.Mock).mockResolvedValue({
      success: true,
    });

    renderSystemMaterial();

    await waitFor(
      () => {
        const fileItem = screen.getByText("test.pdf");
        fireEvent.click(fileItem);
      },
      { timeout: 3000 },
    );

    // Find and click delete button in options menu
    await waitFor(() => {
      const optionsButtons = screen.getAllByText("⋮");
      // Click the second one (for the PDF file)
      fireEvent.click(optionsButtons[1]);
    });

    await waitFor(() => {
      const deleteButton = screen.getByText("Xóa");
      fireEvent.click(deleteButton);
    });

    // Check if delete confirmation modal appears
    expect(screen.queryByText("Xác nhận xóa")).toBeInTheDocument();
  });

  it("handles breadcrumb navigation", async () => {
    renderSystemMaterial();

    await waitFor(
      () => {
        const folderItems = screen.getAllByText("test-folder");
        // Click the first one (the folder item in the grid)
        fireEvent.doubleClick(folderItems[0]);
      },
      { timeout: 3000 },
    );

    // Check if breadcrumb shows folder name
    await waitFor(() => {
      const breadcrumbItems = screen.getAllByText("test-folder");
      expect(breadcrumbItems.length).toBeGreaterThan(1);
    });
  });

  it("handles mobile view", async () => {
    // Set mobile width before rendering
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderSystemMaterial();

    // Wait for the component to detect mobile view and render accordingly
    await waitFor(() => {
      // In mobile view, the text should be hidden by CSS
      // The component renders the text but it's hidden by the 'hidden' class
      const uploadText = screen.getByText("Tải tài liệu lên");
      const folderText = screen.getByText("Tạo thư mục mới");

      // Check that the elements have the 'hidden' class
      expect(uploadText).toHaveClass("hidden");
      expect(folderText).toHaveClass("hidden");
    });
  });
});
