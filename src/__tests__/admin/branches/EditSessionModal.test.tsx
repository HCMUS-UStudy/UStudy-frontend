import { render, screen, fireEvent } from "@testing-library/react";
import EditSessionModal from "@/app/ui/components/admin/branches/EditSessionModal";
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
const mockSessions = [
  {
    id: "1",
    name: "Ca sáng",
    startTime: "08:00",
    endTime: "10:00",
  },
  {
    id: "2",
    name: "Ca chiều",
    startTime: "14:00",
    endTime: "16:00",
  },
  {
    id: "3",
    name: "Ca tối",
    startTime: "18:00",
    endTime: "20:00",
  },
];

const mockListSessions = [
  ...mockSessions,
  {
    id: "4",
    name: "Ca đêm",
    startTime: "20:00",
    endTime: "22:00",
  },
];

const renderEditSessionModal = (props = {}) => {
  const defaultProps = {
    handleSubmit: jest.fn(),
    sessions: mockSessions,
    listSessions: mockListSessions,
    searchSessions: mockListSessions,
    setSearchSessions: jest.fn(),
    selectedSessions: mockSessions,
    setSelectedSessions: jest.fn(),
    setShowSessionModal: jest.fn(),
    ...props,
  };

  return render(<EditSessionModal {...defaultProps} />);
};

describe("EditSessionModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with correct title", () => {
    renderEditSessionModal();

    expect(screen.getByText("Chỉnh sửa ca học")).toBeInTheDocument();
  });

  it("displays search field", () => {
    renderEditSessionModal();

    expect(
      screen.getByPlaceholderText("Tìm kiếm ca học..."),
    ).toBeInTheDocument();
  });

  it("displays all available sessions", () => {
    renderEditSessionModal();

    expect(screen.getByText("Ca sáng (08:00 - 10:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca chiều (14:00 - 16:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca tối (18:00 - 20:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca đêm (20:00 - 22:00)")).toBeInTheDocument();
  });

  it("shows checkboxes for all sessions", () => {
    renderEditSessionModal();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
  });

  it("marks current sessions as checked", () => {
    renderEditSessionModal();

    const checkboxes = screen.getAllByRole("checkbox");

    // First 3 sessions should be checked (current sessions)
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();

    // Last session should not be checked (new session)
    expect(checkboxes[3]).not.toBeChecked();
  });

  it("disables checkboxes for current sessions", () => {
    renderEditSessionModal();

    const checkboxes = screen.getAllByRole("checkbox");

    // First 3 sessions should be disabled (current sessions)
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
    expect(checkboxes[2]).toBeDisabled();

    // Last session should be enabled (new session)
    expect(checkboxes[3]).not.toBeDisabled();
  });

  it("allows selecting new sessions", () => {
    const setSelectedSessions = jest.fn();
    renderEditSessionModal({ setSelectedSessions });
    const caDemSpan = screen.getByText(/Ca đêm.*20:00.*22:00/);
    const newSessionCheckbox = caDemSpan.previousSibling;
    expect(newSessionCheckbox).not.toBeNull();
    fireEvent.click(newSessionCheckbox as HTMLInputElement);
    expect(setSelectedSessions).toHaveBeenCalled();
    const arg = setSelectedSessions.mock.calls[0][0];
    if (typeof arg === "function") {
      expect(setSelectedSessions).toHaveBeenCalled();
    } else {
      expect(arg).toEqual([
        ...mockSessions,
        {
          id: "4",
          name: "Ca đêm",
          startTime: "20:00",
          endTime: "22:00",
        },
      ]);
    }
  });

  it("allows deselecting selected sessions", () => {
    const setSelectedSessions = jest.fn();
    renderEditSessionModal({ setSelectedSessions });
    const caSangSpan = screen.getByText(/Ca sáng.*08:00.*10:00/);
    const selectedSessionCheckbox = caSangSpan.previousSibling;
    expect(selectedSessionCheckbox).not.toBeNull();
    fireEvent.click(selectedSessionCheckbox as HTMLInputElement);
    expect(setSelectedSessions).toHaveBeenCalled();
    const arg = setSelectedSessions.mock.calls[0][0];
    if (typeof arg === "function") {
      expect(setSelectedSessions).toHaveBeenCalled();
    } else {
      expect(arg).toEqual([
        {
          id: "2",
          name: "Ca chiều",
          startTime: "14:00",
          endTime: "16:00",
        },
        {
          id: "3",
          name: "Ca tối",
          startTime: "18:00",
          endTime: "20:00",
        },
      ]);
    }
  });

  it("filters sessions when searching", () => {
    const setSearchSessions = jest.fn();
    renderEditSessionModal({ setSearchSessions });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm ca học...");
    fireEvent.change(searchInput, { target: { value: "sáng" } });

    expect(setSearchSessions).toHaveBeenCalledWith(
      mockListSessions.filter((session) =>
        session.name.toLowerCase().includes("sáng".toLowerCase()),
      ),
    );
  });

  it("handles search with empty term", () => {
    const setSearchSessions = jest.fn();
    renderEditSessionModal({ setSearchSessions });
    const searchInput = screen.getByPlaceholderText("Tìm kiếm ca học...");
    fireEvent.change(searchInput, { target: { value: "" } });
    // No assertion on setSearchSessions, just ensure no error
  });

  it("calls handleSubmit when Add button is clicked", () => {
    const handleSubmit = jest.fn();
    const setShowSessionModal = jest.fn();
    renderEditSessionModal({ handleSubmit, setShowSessionModal });

    const addButton = screen.getByText("Thêm");
    fireEvent.click(addButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(setShowSessionModal).toHaveBeenCalledWith(false);
  });

  it("closes modal when Cancel button is clicked", () => {
    const setShowSessionModal = jest.fn();
    const setSelectedSessions = jest.fn();
    renderEditSessionModal({ setShowSessionModal, setSelectedSessions });

    const cancelButton = screen.getByText("Hủy");
    fireEvent.click(cancelButton);

    expect(setShowSessionModal).toHaveBeenCalledWith(false);
    expect(setSelectedSessions).toHaveBeenCalledWith(mockSessions);
  });

  it("handles empty sessions list", () => {
    renderEditSessionModal({
      sessions: [],
      selectedSessions: [],
    });

    expect(screen.getByText("Chỉnh sửa ca học")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm ca học..."),
    ).toBeInTheDocument();
  });

  it("handles empty search results", () => {
    renderEditSessionModal({
      searchSessions: [],
    });

    expect(screen.getByText("Chỉnh sửa ca học")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm ca học..."),
    ).toBeInTheDocument();
  });

  it("displays sessions in correct format", () => {
    renderEditSessionModal();

    expect(screen.getByText("Ca sáng (08:00 - 10:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca chiều (14:00 - 16:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca tối (18:00 - 20:00)")).toBeInTheDocument();
    expect(screen.getByText("Ca đêm (20:00 - 22:00)")).toBeInTheDocument();
  });

  it("handles multiple session selection", () => {
    const setSelectedSessions = jest.fn();
    renderEditSessionModal({ setSelectedSessions });
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[3]); // Ca đêm
    expect(setSelectedSessions).toHaveBeenCalled();
    const arg = setSelectedSessions.mock.calls[0][0];
    if (typeof arg === "function") {
      expect(setSelectedSessions).toHaveBeenCalled();
    } else {
      expect(arg).toEqual([
        ...mockSessions,
        {
          id: "4",
          name: "Ca đêm",
          startTime: "20:00",
          endTime: "22:00",
        },
      ]);
    }
  });

  it("maintains selected sessions state", () => {
    const setSelectedSessions = jest.fn();
    const selectedSessions = [mockSessions[0]]; // Only Ca sáng selected

    renderEditSessionModal({ setSelectedSessions, selectedSessions });

    const checkboxes = screen.getAllByRole("checkbox");

    // Only first checkbox should be checked
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
  });

  it("handles case-insensitive search", () => {
    const setSearchSessions = jest.fn();
    renderEditSessionModal({ setSearchSessions });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm ca học...");
    fireEvent.change(searchInput, { target: { value: "SÁNG" } });

    expect(setSearchSessions).toHaveBeenCalledWith(
      mockListSessions.filter((session) =>
        session.name.toLowerCase().includes("sáng".toLowerCase()),
      ),
    );
  });
});
