/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadModal from "@/app/ui/components/user/teacher/UploadModal";

// Mock react-dropzone
jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: () => ({
      onClick: jest.fn(),
    }),
    getInputProps: () => ({
      type: "file",
      accept: "*/*",
    }),
    isDragActive: false,
  })),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

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

// Mock the Tooltip component
jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({ children, text }: any) {
    return <div data-testid={`tooltip-${text}`}>{children}</div>;
  };
});

describe("UploadModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with correct title", () => {
    render(<UploadModal onClose={mockOnClose} onUpload={mockOnUpload} />);

    expect(screen.getByText("Tải tài liệu lên")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(<UploadModal onClose={mockOnClose} onUpload={mockOnUpload} />);

    const closeButton = screen
      .getByTestId("tooltip-Đóng")
      .querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<UploadModal onClose={mockOnClose} onUpload={mockOnUpload} />);

    const closeButton = screen
      .getByTestId("tooltip-Đóng")
      .querySelector("button");
    await act(async () => {
      await user.click(closeButton!);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders dropzone area when no file is selected", () => {
    render(<UploadModal onClose={mockOnClose} onUpload={mockOnUpload} />);

    expect(screen.getByText("Kéo thả tệp vào đây hoặc")).toBeInTheDocument();
    expect(screen.getByText("nhấn để chọn")).toBeInTheDocument();
  });
});
