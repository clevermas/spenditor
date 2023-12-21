import { fireEvent, render, screen } from "@testing-library/react";
import DarkModeToggle from "./dark-mode-toggle";

const initialUseTheme = () => ({
  theme: "dark",
  setTheme: jest.fn(),
});

const mocks = {
  useTheme: initialUseTheme(),
};

jest.mock("next-themes", () => {
  return {
    useTheme: () => mocks.useTheme,
  };
});

describe("Dark Mode Toggle", () => {
  beforeEach(() => {
    mocks.useTheme = initialUseTheme();
  });

  test("switches to light mode correctly", () => {
    render(<DarkModeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));

    expect(mocks.useTheme.setTheme).toHaveBeenCalledWith("light");
  });

  test("switches to dark mode correctly", () => {
    mocks.useTheme.theme = "light";
    render(<DarkModeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));

    expect(mocks.useTheme.setTheme).toHaveBeenCalledWith("dark");
  });
});
