import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RoomPage from "@/app/(admin)/admin/rooms/page";
import branchReducer from "@/app/store/branch-slice";
import "@testing-library/jest-dom";

// Mock the components
jest.mock("@/app/ui/components/admin/rooms/RoomsAdminPage", () => {
  return function MockRoomsAdminPage({
    searchQuery,
  }: {
    searchQuery?: string;
  }) {
    return (
      <div data-testid="rooms-admin-page">RoomsAdminPage {searchQuery}</div>
    );
  };
});

jest.mock("@/app/ui/components/admin/rooms/RoomNumber", () => {
  return function MockRoomNumber({ searchQuery }: { searchQuery?: string }) {
    return <div data-testid="room-number">RoomNumber {searchQuery}</div>;
  };
});

jest.mock("@/app/ui/components/admin/rooms/AddRoomModal", () => {
  return function MockAddRoomModal({ buttonLabel }: { buttonLabel: string }) {
    return <div data-testid="add-room-modal">{buttonLabel}</div>;
  };
});

jest.mock("@/app/ui/components/_common/text-field", () => ({
  SearchField: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="search-field">{placeholder}</div>
  ),
}));

// Create mock store
const createMockStore = () =>
  configureStore({
    reducer: {
      branch: branchReducer,
    },
    preloadedState: {
      branch: {
        selectedBranchId: "branch-1",
        branches: [
          {
            id: "branch-1",
            name: "Chi nhánh 1",
            address: "123 Đường ABC",
            contactNumber: "0123456789",
            rooms: 10,
            status: "ACTIVE" as const,
            sessions: [],
          },
          {
            id: "branch-2",
            name: "Chi nhánh 2",
            address: "456 Đường XYZ",
            contactNumber: "0987654321",
            rooms: 8,
            status: "ACTIVE" as const,
            sessions: [],
          },
        ],
      },
    },
  });

// Create mock query client
const createMockQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("RoomPage", () => {
  const mockStore = createMockStore();
  const mockQueryClient = createMockQueryClient();

  const renderWithProviders = async (
    searchParams?: Promise<{ query?: string }>,
  ) => {
    const resolvedSearchParams = searchParams || Promise.resolve({});
    const page = await RoomPage({ searchParams: resolvedSearchParams });

    return render(
      <Provider store={mockStore}>
        <QueryClientProvider client={mockQueryClient}>
          {page}
        </QueryClientProvider>
      </Provider>,
    );
  };

  it("renders the room page with all components", async () => {
    await renderWithProviders();

    // Check if all main components are rendered
    expect(screen.getByTestId("room-number")).toBeInTheDocument();
    expect(screen.getByTestId("add-room-modal")).toBeInTheDocument();
    expect(screen.getByTestId("search-field")).toBeInTheDocument();
    expect(screen.getByTestId("rooms-admin-page")).toBeInTheDocument();
  });

  it("passes correct props to child components", async () => {
    const searchParams = Promise.resolve({ query: "test-query" });
    await renderWithProviders(searchParams);

    // Check if search query is passed correctly
    expect(screen.getByTestId("room-number")).toHaveTextContent("test-query");
    expect(screen.getByTestId("rooms-admin-page")).toHaveTextContent(
      "test-query",
    );
  });

  it("renders with empty search query when no query provided", async () => {
    await renderWithProviders();

    // Check if components render with empty query
    expect(screen.getByTestId("room-number")).toHaveTextContent("RoomNumber");
    expect(screen.getByTestId("rooms-admin-page")).toHaveTextContent(
      "RoomsAdminPage",
    );
  });

  it("renders search field with correct placeholder", async () => {
    await renderWithProviders();

    expect(screen.getByTestId("search-field")).toHaveTextContent(
      "Tìm kiếm phòng học...",
    );
  });

  it("renders add room modal with correct button label", async () => {
    await renderWithProviders();

    expect(screen.getByTestId("add-room-modal")).toHaveTextContent(
      "Tạo phòng học",
    );
  });

  it("has correct page structure and layout", async () => {
    await renderWithProviders();

    // Check for main container
    const mainContainer = screen.getByTestId("rooms-root");
    expect(mainContainer).toHaveClass("px-2");

    // Check for header section
    // Optionally, add data-testid to header section in the page for more robust test
  });
});
