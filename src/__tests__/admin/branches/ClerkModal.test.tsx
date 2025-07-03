import { render, screen, fireEvent } from "@testing-library/react";
import ClerkModal from "@/app/ui/components/admin/branches/ClerkModal";
import "@testing-library/jest-dom";

// Mock the components
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, type, ...props }: any) => (
    <button onClick={onClick} type={type} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function SearchField({ placeholder, onSearch }: any) {
    return (
      <input
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    );
  };
});

// Mock data
const mockClerks = [
  {
    id: "clerk1",
    genId: "GV001",
    name: "Clerk 1",
    email: "clerk1@example.com",
    avatar: "",
    gender: "Male",
  },
  {
    id: "clerk2",
    genId: "GV002",
    name: "Clerk 2",
    email: "clerk2@example.com",
    avatar: "",
    gender: "Female",
  },
];

const mockAvailableClerks = [
  {
    id: "clerk3",
    genId: "GV003",
    name: "Available Clerk 3",
    email: "clerk3@example.com",
    avatar: "",
    gender: "Male",
  },
  {
    id: "clerk4",
    genId: "GV004",
    name: "Available Clerk 4",
    email: "clerk4@example.com",
    avatar: "",
    gender: "Female",
  },
];

const renderClerkModal = (props = {}) => {
  const defaultProps = {
    handleSubmit: jest.fn(),
    clerks: mockClerks,
    availableClerks: mockAvailableClerks,
    searchClerks: mockAvailableClerks,
    setSearchClerks: jest.fn(),
    selectedClerks: mockClerks,
    setSelectedClerks: jest.fn(),
    setShowClerkModal: jest.fn(),
    ...props,
  };

  return render(<ClerkModal {...defaultProps} />);
};

describe("ClerkModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with correct title", () => {
    renderClerkModal();

    expect(screen.getByText("Chỉnh sửa giáo vụ")).toBeInTheDocument();
  });

  it("displays search field", () => {
    renderClerkModal();

    expect(
      screen.getByPlaceholderText("Tìm kiếm giáo vụ..."),
    ).toBeInTheDocument();
  });

  it("displays available clerks", () => {
    renderClerkModal();

    expect(screen.getByText("GV003 - Available Clerk 3")).toBeInTheDocument();
    expect(screen.getByText("GV004 - Available Clerk 4")).toBeInTheDocument();
  });

  it("shows checkboxes for all clerks", () => {
    renderClerkModal();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("marks current clerks as checked", () => {
    renderClerkModal({
      selectedClerks: mockAvailableClerks,
      searchClerks: mockAvailableClerks,
      availableClerks: mockAvailableClerks,
      clerks: mockAvailableClerks,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("allows selecting new clerks", () => {
    const setSelectedClerks = jest.fn();
    renderClerkModal({
      selectedClerks: [],
      setSelectedClerks,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    const newClerkCheckbox = checkboxes[0];

    fireEvent.click(newClerkCheckbox);

    expect(setSelectedClerks).toHaveBeenCalled();
  });

  it("allows deselecting selected clerks", () => {
    const setSelectedClerks = jest.fn();
    renderClerkModal({ setSelectedClerks });

    const checkboxes = screen.getAllByRole("checkbox");
    const selectedClerkCheckbox = checkboxes[0];

    fireEvent.click(selectedClerkCheckbox);

    expect(setSelectedClerks).toHaveBeenCalled();
  });

  it("filters clerks when searching", () => {
    const setSearchClerks = jest.fn();
    renderClerkModal({ setSearchClerks });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm giáo vụ...");
    fireEvent.change(searchInput, { target: { value: "Clerk 3" } });

    expect(setSearchClerks).toHaveBeenCalledWith(
      mockAvailableClerks.filter(
        (clerk) =>
          clerk.name.toLowerCase().includes("Clerk 3".toLowerCase()) ||
          clerk.genId.toLowerCase().includes("Clerk 3".toLowerCase()),
      ),
    );
  });

  it("handles search with empty term", () => {
    const setSearchClerks = jest.fn();
    renderClerkModal({ setSearchClerks });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm giáo vụ...");
    fireEvent.change(searchInput, { target: { value: "abc" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    expect(setSearchClerks).toHaveBeenCalled();
  });

  it("calls handleSubmit when Add button is clicked", () => {
    const handleSubmit = jest.fn();
    const setShowClerkModal = jest.fn();
    renderClerkModal({ handleSubmit, setShowClerkModal });

    const addButton = screen.getByText("Thêm");
    fireEvent.click(addButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(setShowClerkModal).toHaveBeenCalledWith(false);
  });

  it("closes modal when Cancel button is clicked", () => {
    const setShowClerkModal = jest.fn();
    const setSelectedClerks = jest.fn();
    renderClerkModal({ setShowClerkModal, setSelectedClerks });

    const cancelButton = screen.getByText("Hủy");
    fireEvent.click(cancelButton);

    expect(setShowClerkModal).toHaveBeenCalledWith(false);
    expect(setSelectedClerks).toHaveBeenCalledWith(mockClerks);
  });

  it("handles empty clerks list", () => {
    renderClerkModal({
      clerks: [],
      availableClerks: [],
      searchClerks: [],
      selectedClerks: [],
    });

    expect(screen.getByText("Chỉnh sửa giáo vụ")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm giáo vụ..."),
    ).toBeInTheDocument();
  });

  it("displays clerks in correct format", () => {
    renderClerkModal();

    expect(screen.getByText("GV003 - Available Clerk 3")).toBeInTheDocument();
    expect(screen.getByText("GV004 - Available Clerk 4")).toBeInTheDocument();
  });

  it("handles multiple clerk selection", () => {
    const setSelectedClerks = jest.fn();
    renderClerkModal({
      selectedClerks: [],
      setSelectedClerks,
    });

    const checkboxes = screen.getAllByRole("checkbox");

    // Select multiple clerks
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    expect(setSelectedClerks).toHaveBeenCalled();
  });

  it("maintains selected clerks state", () => {
    const setSelectedClerks = jest.fn();
    const selectedClerks = [mockAvailableClerks[0]]; // Only first clerk selected

    renderClerkModal({ setSelectedClerks, selectedClerks });

    const checkboxes = screen.getAllByRole("checkbox");

    // Only first checkbox should be checked
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("handles case-insensitive search", () => {
    const setSearchClerks = jest.fn();
    renderClerkModal({ setSearchClerks });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm giáo vụ...");
    fireEvent.change(searchInput, { target: { value: "CLERK 3" } });

    expect(setSearchClerks).toHaveBeenCalledWith(
      mockAvailableClerks.filter(
        (clerk) =>
          clerk.name.toLowerCase().includes("clerk 3".toLowerCase()) ||
          clerk.genId.toLowerCase().includes("clerk 3".toLowerCase()),
      ),
    );
  });
});
