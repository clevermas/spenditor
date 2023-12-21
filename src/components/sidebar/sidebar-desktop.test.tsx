import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SidebarDesktop from "./sidebar-desktop";

jest.mock("@clerk/nextjs", () => {
  return { UserButton: () => <></> };
});

describe("Desktop Sidebar", () => {
  test("handles burger menu click", () => {
    const spy = jest.fn();

    render(<SidebarDesktop isOpen={false} onToggle={spy} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "burger-menu",
      })
    );

    expect(spy).toHaveBeenCalled();
  });
});
