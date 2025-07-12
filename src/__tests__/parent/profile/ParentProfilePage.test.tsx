import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MemberProfilePage from "@/app/(user)/member/profile/page";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";

// Mock getProfle và getUserDataFromCookies
jest.mock("@/app/lib/services/user", () => ({
  getProfle: jest.fn(() => Promise.resolve({ data: mockUser })),
}));
jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(() =>
    Promise.resolve({ role: { defaultRoute: "PARENT" } }),
  ),
}));

const mockUser = {
  id: "1",
  genId: "HS001",
  name: "Nguyen Van A",
  email: "a@gmail.com",
  avatar: "/avatar.png",
  phone: "0123456789",
  address: "Hanoi",
  gender: "MALE",
  birthday: "2000-01-01",
};

const mockChildren = [
  {
    id: "c1",
    name: "Child One",
    email: "child1@gmail.com",
    phone: "0999999999",
    avatar: "/child1.png",
    gender: "FEMALE",
  },
  {
    id: "c2",
    name: "Child Two",
    email: "child2@gmail.com",
    phone: "0888888888",
    avatar: "/child2.png",
    gender: "MALE",
  },
];

// Mock useSelector để trả về children
jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useSelector: jest.fn((fn) => fn({ children: { children: mockChildren } })),
  };
});

describe("ParentProfilePage", () => {
  it("hiển thị loading khi đang tải", () => {
    // Để isLoading true ban đầu, kiểm tra skeleton
    const { container } = render(
      <Provider store={store}>
        <MemberProfilePage />
      </Provider>,
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("hiển thị thông tin user và danh sách con khi defaultRoute là PARENT", async () => {
    render(
      <Provider store={store}>
        <MemberProfilePage />
      </Provider>,
    );
    // Đợi user và children render
    await waitFor(() => {
      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
      // Dùng matcher function cho mã số
      expect(
        screen.getByText((content, node) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasText = (node: any) => node.textContent === "Mã số: HS001";
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node?.children || []).every(
            (child) => !hasText(child),
          );
          return nodeHasText && childrenDontHaveText;
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("Danh sách con")).toBeInTheDocument();
      expect(screen.getByText("Child One")).toBeInTheDocument();
      expect(screen.getByText("Child Two")).toBeInTheDocument();
    });
  });

  it("hiển thị thông báo khi không có con nào", async () => {
    // Mock useSelector trả về children rỗng
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const useSelector = require("react-redux").useSelector;
    useSelector.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fn: (arg0: { children: { children: never[] } }) => any) =>
        fn({ children: { children: [] } }),
    );
    const { container } = render(
      <Provider store={store}>
        <MemberProfilePage />
      </Provider>,
    );
    await waitFor(() => {
      // Kiểm tra không có phần tử con nào được render
      const childCards = container.querySelectorAll(
        ".bg-gray-50.rounded-xl.p-4.border.border-gray-200",
      );
      expect(childCards.length).toBe(0);
    });
  });
});
