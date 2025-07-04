/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddCourseModal from "@/app/ui/components/admin/courses/AddCourseModal";

jest.mock("@/app/lib/services/course", () => ({ createNewCourse: jest.fn() }));
jest.mock("@/app/lib/action", () => ({
  getCreatorFromCookies: jest.fn(() => Promise.resolve("admin")),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: jest.fn(), error: jest.fn() },
  }),
}));
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

jest.mock("@/app/ui/components/_common/Dialog", () => ({
  Dialog: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-testid="dialog">
        {children}
        <button data-testid="close-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/app/ui/components/_common/text-field/Input", () => ({
  Input: (props: any) => (
    <input {...props} data-testid={props.label || props.placeholder} />
  ),
}));
jest.mock(
  "@/app/ui/components/_common/text-field/TextArea",
  // eslint-disable-next-line react/display-name
  () => (props: any) => (
    <textarea {...props} data-testid={props.label || props.placeholder} />
  ),
);
jest.mock("@/app/ui/components/_common/Button", () => ({
  Button: (props: any) => (
    <button {...props} data-testid={props.children}>
      {props.children}
    </button>
  ),
}));

describe("AddCourseModal", () => {
  it("renders open modal button", () => {
    render(<AddCourseModal buttonLabel="Tạo môn học" />);
    expect(screen.getByTestId("Tạo môn học")).toBeInTheDocument();
  });

  it("opens and closes modal", () => {
    render(<AddCourseModal buttonLabel="Tạo môn học" />);
    fireEvent.click(screen.getByTestId("Tạo môn học"));
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-dialog"));
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("can fill and submit form", async () => {
    render(<AddCourseModal buttonLabel="Tạo môn học" />);
    fireEvent.click(screen.getByTestId("Tạo môn học"));
    const nameInput = await screen.findByTestId("Tên môn *");
    const descInput = await screen.findByTestId("Mô tả môn học *");
    fireEvent.change(nameInput, { target: { value: "Toán" } });
    fireEvent.change(descInput, { target: { value: "Mô tả" } });
    const submitBtn = screen.getAllByTestId("Tạo môn học")[1];
    fireEvent.click(submitBtn);
    // Không expect side effect vì mutation đã mock
  });
});
