import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

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

describe("Theme Toggle", () => {
  beforeEach(() => {
    mocks.useTheme = initialUseTheme();
  });

  test("switches to light mode correctly", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));

    expect(mocks.useTheme.setTheme).toHaveBeenCalledWith("light");
  });

  test("switches to dark mode correctly", () => {
    mocks.useTheme.theme = "light";
    render(<ThemeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));

    expect(mocks.useTheme.setTheme).toHaveBeenCalledWith("dark");
  });
});
