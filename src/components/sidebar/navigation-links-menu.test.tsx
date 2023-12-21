import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import NavigationLinksMenu from "./navigation-links-menu";

describe("Navigation Links Menu", () => {
  test("renders navigations link correctly", () => {
    render(<NavigationLinksMenu />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  test("handles link click", async () => {
    const spy = jest.fn();

    render(<NavigationLinksMenu onLinkClick={spy} />);
    fireEvent.click(screen.getByText("Home"));

    expect(spy).toHaveBeenCalled();
  });
});
