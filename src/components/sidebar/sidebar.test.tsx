import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

import Sidebar from "./sidebar";

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

jest.mock("@clerk/nextjs", () => {
  return { UserButton: () => <></> };
});

describe("Sidebar", () => {
  beforeEach(() => {
    dispatch.mockClear();
  });

  test("handles toggle correctly", () => {
    renderWithProviders(<Sidebar />);

    fireEvent.click(
      screen.queryAllByRole("button", { name: "burger-menu" })[0]
    );

    expect(dispatch).toHaveBeenCalled();
  });
});
