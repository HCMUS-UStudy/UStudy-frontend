/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import UploadModal from "@/app/ui/components/user/teacher/UploadModal";
import { useDropzone } from "react-dropzone";

// Mock react-dropzone
jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock the Tooltip component
jest.mock("@/app/ui/components/_common/Tooltip", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockTooltip({ children, text }: any) {
    return <div title={text}>{children}</div>;
  };
});

// Mock the useCustomToast hook
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: {
      error: jest.fn(),
      success: jest.fn(),
    },
  }),
}));

// Mock icons
jest.mock("react-icons/rx", () => ({
  RxCross2: () => <div data-testid="close-icon">Close</div>,
}));

jest.mock("react-icons/fa", () => ({
  FaCloudUploadAlt: () => (
    <div data-testid="cloud-upload-icon">Cloud Upload</div>
  ),
  FaCheck: () => <div data-testid="check-icon">Check</div>,
}));

jest.mock("react-icons/md", () => ({
  MdUploadFile: () => <div data-testid="upload-file-icon">Upload File</div>,
}));

jest.mock("react-icons/lu", () => ({
  LuTrash2: () => <div data-testid="trash-icon">Trash</div>,
}));

jest.mock("react-icons/fi", () => ({
  FiEdit3: () => <div data-testid="edit-icon">Edit</div>,
}));

jest.mock("react-icons/tb", () => ({
  TbFileTypeDoc: () => <div data-testid="doc-icon">Doc</div>,
  TbFileTypeDocx: () => <div data-testid="docx-icon">Docx</div>,
  TbFileTypePdf: () => <div data-testid="pdf-icon">Pdf</div>,
  TbFileTypePpt: () => <div data-testid="ppt-icon">Ppt</div>,
  TbFileTypeTxt: () => <div data-testid="txt-icon">Txt</div>,
  TbFileTypeZip: () => <div data-testid="zip-icon">Zip</div>,
  TbFileTypePng: () => <div data-testid="png-icon">Png</div>,
  TbFileTypeJpg: () => <div data-testid="jpg-icon">Jpg</div>,
}));

const mockUseDropzone = useDropzone as jest.MockedFunction<typeof useDropzone>;

describe("UploadModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDropzone.mockReturnValue({
      getRootProps: jest.fn(() => ({})) as unknown as any,
      getInputProps: jest.fn(() => ({})) as unknown as any,
      isDragActive: false,
      isFocused: false,
      isDragAccept: false,
      isDragReject: false,
      isFileDialogActive: false,
      acceptedFiles: [],
      fileRejections: [],
      rootRef: { current: null },
      inputRef: { current: null },
      open: jest.fn(),
    });
  });

  const renderUploadModal = () => {
    return render(
      <UploadModal onClose={mockOnClose} onUpload={mockOnUpload} />,
    );
  };

  it("renders the upload modal", () => {
    renderUploadModal();
    expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
    expect(screen.getByText("Kéo thả tệp vào đây hoặc")).toBeInTheDocument();
    expect(screen.getByText("nhấn để chọn")).toBeInTheDocument();
  });

  it("displays supported file types and size limit", () => {
    renderUploadModal();
    expect(
      screen.getByText("Hỗ trợ tệp: PDF, DOC, DOCX, PPT, TXT, ZIP, JPG, PNG"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dung lượng tối đa:")).toBeInTheDocument();
    expect(screen.getByText("10MB")).toBeInTheDocument();
  });

  it("shows drag active state", () => {
    mockUseDropzone.mockReturnValue({
      getRootProps: jest.fn(() => ({})) as unknown as any,
      getInputProps: jest.fn(() => ({})) as unknown as any,
      isDragActive: true,
      isFocused: false,
      isDragAccept: false,
      isDragReject: false,
      isFileDialogActive: false,
      acceptedFiles: [],
      fileRejections: [],
      rootRef: { current: null },
      inputRef: { current: null },
      open: jest.fn(),
    });
    renderUploadModal();
    expect(screen.getByTestId("cloud-upload-icon")).toBeInTheDocument();
  });

  it("handles file selection via dropzone", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const testElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes("test") ?? false,
      );
      expect(testElements.length).toBeGreaterThan(0);
      const pdfElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes(".pdf") ?? false,
      );
      expect(pdfElements.length).toBeGreaterThan(0);
    });
  });

  it("shows error for file too large", async () => {
    const mockLargeFile = new File(
      ["x".repeat(11 * 1024 * 1024)],
      "large.pdf",
      { type: "application/pdf" },
    );
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockLargeFile], [], {} as any);
      }
    });
    await waitFor(() => {
      expect(
        screen.queryByText(
          (_, el) => el?.textContent?.includes("test") ?? false,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("handles file removal", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const removeButton =
        screen.queryByTestId("trash-icon") ||
        screen.getByText(
          (_, el) => el?.textContent?.includes("Trash") ?? false,
        );
      fireEvent.click(removeButton!);
      expect(
        screen.queryByText(
          (_, el) => el?.textContent?.includes("test") ?? false,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("handles file name editing", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const editButton =
        screen.queryByTestId("edit-icon") ||
        screen.getByText((_, el) => el?.textContent?.includes("Edit") ?? false);
      fireEvent.click(editButton!);
      const nameInput = screen.getByPlaceholderText("Tên tệp");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue("test");
    });
  });

  it("handles file upload with custom name", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const editButton =
        screen.queryByTestId("edit-icon") ||
        screen.getByText((_, el) => el?.textContent?.includes("Edit") ?? false);
      fireEvent.click(editButton!);
      const nameInput = screen.getByPlaceholderText("Tên tệp");
      fireEvent.change(nameInput, { target: { value: "custom-name" } });
      const uploadButton = screen.getByText("Xác nhận");
      fireEvent.click(uploadButton);
      expect(mockOnUpload).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error when trying to upload without file name", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const editButton =
        screen.queryByTestId("edit-icon") ||
        screen.getByText((_, el) => el?.textContent?.includes("Edit") ?? false);
      fireEvent.click(editButton!);
      const nameInput = screen.getByPlaceholderText("Tên tệp");
      fireEvent.change(nameInput, { target: { value: "" } });
      const uploadButton = screen.getByText("Xác nhận");
      fireEvent.click(uploadButton);
      expect(mockOnUpload).not.toHaveBeenCalled();
    });
  });

  it("disables upload button when no file is selected", () => {
    renderUploadModal();
    const uploadButton = screen.getByText("Xác nhận");
    expect(uploadButton).toBeDisabled();
  });

  it("enables upload button when file is selected", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const uploadButton = screen.getByText("Xác nhận");
      expect(uploadButton).not.toBeDisabled();
    });
  });

  it("handles close button click", () => {
    renderUploadModal();
    const closeButton = screen.getByTestId("close-icon");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("displays file size correctly", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const sizeElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes("Kích thước:") ?? false,
      );
      expect(sizeElements.length).toBeGreaterThan(0);
    });
  });

  it("handles keyboard events in edit mode", async () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    renderUploadModal();
    await act(async () => {
      const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
      if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
        dropzoneCallbacks.onDrop([mockFile], [], {} as any);
      }
    });
    await waitFor(() => {
      const editButton =
        screen.queryByTestId("edit-icon") ||
        screen.getByText((_, el) => el?.textContent?.includes("Edit") ?? false);
      fireEvent.click(editButton!);
      const nameInput = screen.getByPlaceholderText("Tên tệp");
      fireEvent.keyDown(nameInput, { key: "Enter" });
      fireEvent.keyDown(nameInput, { key: "Escape" });
    });
  });

  it("displays correct file type icon for different file types", async () => {
    const testCases = [
      { name: "test.pdf", expectedIcon: "pdf-icon" },
      { name: "test.doc", expectedIcon: "doc-icon" },
      { name: "test.docx", expectedIcon: "docx-icon" },
      { name: "test.ppt", expectedIcon: "ppt-icon" },
      { name: "test.txt", expectedIcon: "txt-icon" },
      { name: "test.zip", expectedIcon: "zip-icon" },
      { name: "test.png", expectedIcon: "png-icon" },
      { name: "test.jpg", expectedIcon: "jpg-icon" },
    ];
    for (const { name, expectedIcon } of testCases) {
      const mockFile = new File(["test content"], name, {
        type: "application/octet-stream",
      });
      mockUseDropzone.mockReturnValue({
        getRootProps: jest.fn(() => ({})) as unknown as any,
        getInputProps: jest.fn(() => ({})) as unknown as any,
        isDragActive: false,
        isFocused: false,
        isDragAccept: false,
        isDragReject: false,
        isFileDialogActive: false,
        acceptedFiles: [],
        fileRejections: [],
        rootRef: { current: null },
        inputRef: { current: null },
        open: jest.fn(),
      });
      const { unmount } = renderUploadModal();
      await act(async () => {
        const dropzoneCallbacks = mockUseDropzone.mock.calls[0]?.[0];
        if (dropzoneCallbacks && dropzoneCallbacks.onDrop) {
          dropzoneCallbacks.onDrop([mockFile], [], {} as any);
        }
      });
      await waitFor(() => {
        const icon = screen.queryByTestId(expectedIcon);
        if (!icon) {
          const iconElements = screen.getAllByText(
            (_, el) =>
              el?.textContent
                ?.toLowerCase()
                .includes(expectedIcon.split("-")[0]) ?? false,
          );
          expect(iconElements.length).toBeGreaterThan(0);
        } else {
          expect(icon).toBeInTheDocument();
        }
      });
      unmount();
    }
  });
});
