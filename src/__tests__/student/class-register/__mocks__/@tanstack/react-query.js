const actual = jest.requireActual("@tanstack/react-query");
module.exports = {
  ...actual,
  useQueries: jest.fn(),
};

test("dummy", () => {});
