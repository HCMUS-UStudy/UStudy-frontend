import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AccountPage from "@/app/(admin)/admin/accounts/page";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

// Mock child components to isolate the AccountPage component for testing
jest.mock("@/app/ui/components/admin/accounts/AccountNumber", () => {
  const AccountNumber = (props: { searchQuery: string; roleQuery: string }) => (
    <div data-testid="account-number">
      {`searchQuery: ${props.searchQuery}, roleQuery: ${props.roleQuery}`}
    </div>
  );
  AccountNumber.displayName = "AccountNumber";
  return AccountNumber;
});

jest.mock("@/app/ui/components/admin/accounts/AddAccountModal", () => {
  const AddAccountModal = (props: { buttonLabel: string }) => (
    <button>{props.buttonLabel}</button>
  );
  AddAccountModal.displayName = "AddAccountModal";
  return AddAccountModal;
});

/* We are un-mocking the SearchField to test the interaction */
// jest.mock(
//   "@/app/ui/components/_common/text-field/SearchField",
//   () => (props: { placeholder: string; className: string }) => (
//     <input
//       placeholder={props.placeholder}
//       className={props.className}
//       data-testid="search-field"
//     />
//   )
// );

/* We are re-mocking the Dropdown to fix the initial tests */
// jest.mock(
//   "@/app/ui/components/_common/Dropdown",
//   () => (props: { label: string; selected: string }) => (
//     <div data-testid="role-dropdown">
//       {`label: ${props.label}, selected: ${props.selected}`}
//     </div>
//   )
// );

jest.mock("@/app/ui/components/admin/accounts/AccountTable", () => {
  const AccountTable = (props: { searchQuery: string; roleQuery: string }) => (
    <div data-testid="account-table">
      {`searchQuery: ${props.searchQuery}, roleQuery: ${props.roleQuery}`}
    </div>
  );
  AccountTable.displayName = "AccountTable";
  return AccountTable;
});

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: jest.fn(),
}));

const useSearchParamsMock = jest.requireMock("next/navigation").useSearchParams;

describe("Admin AccountPage", () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockRouter.replace.mockClear();
    useSearchParamsMock.mockClear();
  });

  // Since AccountPage is an async Server Component, we need to make our test async
  it("renders all child components correctly", async () => {
    // Render the component without any search params
    const page = await AccountPage({ searchParams: Promise.resolve({}) });
    render(page);

    // Check if all mocked components are rendered
    expect(screen.getByTestId("account-number")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tạo người dùng" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm kiếm người dùng..."),
    ).toBeInTheDocument();
    // Use role to find the dropdown button, check for the default "Tất cả" text
    expect(screen.getByRole("button", { name: /tất cả/i })).toBeInTheDocument();
    expect(screen.getByTestId("account-table")).toBeInTheDocument();
  });

  it("passes default props to child components when no search params are provided", async () => {
    const page = await AccountPage({ searchParams: Promise.resolve({}) });
    render(page);

    // Check props for AccountNumber
    const accountNumber = screen.getByTestId("account-number");
    expect(accountNumber).toHaveTextContent("searchQuery: , roleQuery: All");

    // Check props for AccountTable
    const accountTable = screen.getByTestId("account-table");
    expect(accountTable).toHaveTextContent("searchQuery: , roleQuery: All");

    // Check the displayed value in the dropdown button
    expect(screen.getByRole("button", { name: /tất cả/i })).toBeInTheDocument();
  });

  it("passes search and role params to child components correctly", async () => {
    const searchParams = {
      query: "testuser",
      role: "TEACHER",
    };
    useSearchParamsMock.mockReturnValue(new URLSearchParams(searchParams));
    const page = await AccountPage({
      searchParams: Promise.resolve(searchParams),
    });
    render(page);

    // Check props for AccountNumber with params
    const accountNumber = screen.getByTestId("account-number");
    expect(accountNumber).toHaveTextContent(
      "searchQuery: testuser, roleQuery: TEACHER",
    );

    // Check props for AccountTable with params
    const accountTable = screen.getByTestId("account-table");
    expect(accountTable).toHaveTextContent(
      "searchQuery: testuser, roleQuery: TEACHER",
    );

    // Check the displayed value in the dropdown button ("Giáo viên" for TEACHER role)
    expect(
      screen.getByRole("button", { name: /giáo viên/i }),
    ).toBeInTheDocument();
  });

  it("calls router.replace with the correct query when user types in search field", async () => {
    // Set up the initial search params for this test
    useSearchParamsMock.mockReturnValue(new URLSearchParams("?role=All"));

    const page = await AccountPage({ searchParams: Promise.resolve({}) });
    render(page);

    const searchField = screen.getByPlaceholderText("Tìm kiếm người dùng...");
    await userEvent.type(searchField, "admin");

    // Wait for debounce timeout
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
      const calledUrl = new URL(
        mockRouter.replace.mock.calls[0][0],
        "http://localhost",
      );
      expect(calledUrl.searchParams.get("query")).toBe("admin");
      expect(calledUrl.searchParams.get("role")).toBe("All");
    });
  });

  it("calls router.replace with the correct role when user selects from dropdown", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("?query="));

    const page = await AccountPage({ searchParams: Promise.resolve({}) });
    render(page);

    const dropdownTrigger = screen.getByRole("button", { name: /tất cả/i });
    await userEvent.click(dropdownTrigger);

    const teacherOption = await screen.findByRole("button", {
      name: /giáo viên/i,
    });
    await userEvent.click(teacherOption);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
      const calledUrl = new URL(
        mockRouter.replace.mock.calls[0][0],
        "http://localhost",
      );
      expect(calledUrl.searchParams.get("query")).toBe("");
      expect(calledUrl.searchParams.get("role")).toBe("TEACHER");
    });
  });
});
