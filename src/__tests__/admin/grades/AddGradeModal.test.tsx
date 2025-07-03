import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddGradeModal from "@/app/ui/components/admin/grades/AddGradeModal";

jest.mock("@/app/lib/services/grade", () => ({ createNewGrade: jest.fn() }));
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { error: jest.fn(), success: jest.fn() },
  }),
}));
jest.mock("@/app/ui/components/_common/Dialog", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Dialog: ({ isOpen, children }: any) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DialogContent: ({ children }: any) => <div>{children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/app/ui/components/_common/text-field/Input", () => ({
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  Input: React.forwardRef((props: any, ref) => <input ref={ref} {...props} />),
}));
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  Button: React.forwardRef((props: any, ref) => (
    <button ref={ref} {...props} />
  )),
}));

describe("AddGradeModal", () => {
  const mockMutate = jest.fn();
  const mockOnClose = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseMutation = require("@tanstack/react-query").useMutation;

  beforeEach(() => {
    mockMutate.mockReset();
    mockOnClose.mockReset();
    mockUseMutation.mockReturnValue({ mutate: mockMutate, status: "idle" });
  });

  it("renders and submits new grade name", async () => {
    render(<AddGradeModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Khối 13" } });
    const submitBtn = screen.getByRole("button", { name: /tạo khối mới/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ name: "Khối 13" });
    });
  });

  it("calls onClose when dialog closed", () => {
    render(<AddGradeModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });
});
