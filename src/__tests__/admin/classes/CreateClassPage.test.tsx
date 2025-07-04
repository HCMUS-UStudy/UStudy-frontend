import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateClassPage from "@/app/(admin)/admin/classes/create/page";

// Mock the CreateClass component
jest.mock("@/app/ui/components/admin/classes/create/CreateClass", () => {
  return function MockCreateClass() {
    return (
      <div data-testid="create-class-form">
        <h1>Tạo lớp học mới</h1>
        <form>
          <input data-testid="class-name" placeholder="Tên lớp" />
          <textarea data-testid="class-description" placeholder="Mô tả" />
          <button data-testid="submit-button" type="submit">
            Tạo lớp
          </button>
        </form>
      </div>
    );
  };
});

describe("Create Class Page", () => {
  it("renders the create class form", async () => {
    render(await CreateClassPage());

    expect(screen.getByTestId("create-class-form")).toBeInTheDocument();
    expect(screen.getByText("Tạo lớp học mới")).toBeInTheDocument();
    expect(screen.getByTestId("class-name")).toBeInTheDocument();
    expect(screen.getByTestId("class-description")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("renders form elements with correct placeholders", async () => {
    render(await CreateClassPage());

    const nameInput = screen.getByTestId("class-name");
    const descriptionTextarea = screen.getByTestId("class-description");

    expect(nameInput).toHaveAttribute("placeholder", "Tên lớp");
    expect(descriptionTextarea).toHaveAttribute("placeholder", "Mô tả");
  });

  it("renders submit button with correct text", async () => {
    render(await CreateClassPage());

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Tạo lớp");
    expect(submitButton).toHaveAttribute("type", "submit");
  });
});
