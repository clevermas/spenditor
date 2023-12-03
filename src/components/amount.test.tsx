import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Amount } from "./amount";

describe("Amount", () => {
  test("renders amount in currency format", () => {
    render(
      <>
        <Amount value="2.45"></Amount>
        <Amount value="2342"></Amount>
      </>
    );

    expect(screen.getByText("$2.45")).toBeInTheDocument();
    expect(screen.getByText("$2,342.00")).toBeInTheDocument();
  });

  test("renders 0 if given value is not a number", () => {
    render(<Amount value="not a number"></Amount>);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
