import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SidebarMobile from "./sidebar-mobile";

jest.mock("@clerk/nextjs", () => {
  return { UserButton: () => <></> };
});

describe("Mobile Sidebar", () => {
  test("opens menu dialog on burger menu click", () => {
    const spy = jest.fn();

    render(<SidebarMobile />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "burger-menu",
      })
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });
});
