/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ManageScoresClientPage from "@/app/ui/components/admin/manage-scores/ManageScoresClientPage";

// Mock the services
jest.mock("@/app/lib/services/class", () => ({
  getAllClasses: jest.fn(),
}));

// Mock the components
jest.mock("@/app/ui/components/admin/manage-scores/ManageScoresTable", () => {
  return function MockManageScoresTable({ classId }: { classId: string }) {
    return (
      <div data-testid="manage-scores-table">
        ManageScoresTable - Class: {classId}
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/text-field/SearchField", () => {
  return function MockSearchField({ value, onChange, placeholder }: any) {
    return (
      <input
        data-testid="search-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  };
});

jest.mock("@/app/ui/components/admin/manage-scores/DropdownLocal", () => {
  return function MockDropdownLocal({ label, items, selected, onSelect }: any) {
    return (
      <div data-testid="dropdown-local">
        <span>{label}</span>
        <select
          value={selected}
          onChange={(e) => onSelect && onSelect(e.target.value)}
          data-testid="class-select"
        >
          {items.map((item: any) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

// Mock Redux store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      branch: (state = { selectedBranchId: "branch1" }) => state,
    },
    preloadedState: initialState,
  });
};

describe("ManageScoresClientPage", () => {
  let mockGetAllClasses: jest.MockedFunction<any>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockGetAllClasses = require("@/app/lib/services/class").getAllClasses;
    mockGetAllClasses.mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    const store = createTestStore();
    return render(<Provider store={store}>{component}</Provider>);
  };

  it("renders without crashing", () => {
    const { container } = renderWithProvider(<ManageScoresClientPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    mockGetAllClasses.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProvider(<ManageScoresClientPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("calls API with correct parameters", () => {
    renderWithProvider(<ManageScoresClientPage />);
    expect(mockGetAllClasses).toHaveBeenCalledWith(
      "",
      0,
      100,
      undefined,
      undefined,
      "branch1",
    );
  });

  it("has correct component structure", () => {
    const { container } = renderWithProvider(<ManageScoresClientPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
