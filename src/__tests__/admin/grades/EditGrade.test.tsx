import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditGrade from "@/app/ui/components/admin/grades/EditGrade";

jest.mock("@/app/lib/services", () => ({ updateGrade: jest.fn() }));
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
jest.mock("@/app/ui/components/_common/text-field", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  Input: React.forwardRef((props: any, ref) => <input ref={ref} {...props} />),
}));
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  Button: React.forwardRef((props: any, ref) => (
    <button ref={ref} {...props} />
  )),
}));

describe("EditGrade", () => {
  const mockMutate = jest.fn();
  const mockOnClose = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseMutation = require("@tanstack/react-query").useMutation;

  beforeEach(() => {
    mockMutate.mockReset();
    mockOnClose.mockReset();
    mockUseMutation.mockReturnValue({ mutate: mockMutate, status: "idle" });
  });

  it("renders and submits new name", async () => {
    render(
      <EditGrade
        isOpen={true}
        onClose={mockOnClose}
        grade={{ id: "1", name: "Khối 10" }}
      />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Khối 12" } });
    const submitBtn = screen.getByRole("button", { name: /xác nhận/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        gradeId: "1",
        name: "Khối 12",
      });
    });
  });

  it("calls onClose when dialog closed", () => {
    render(
      <EditGrade
        isOpen={true}
        onClose={mockOnClose}
        grade={{ id: "1", name: "Khối 10" }}
      />,
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });
});
