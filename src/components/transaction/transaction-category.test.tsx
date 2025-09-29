import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TransactionCategory } from "./transaction-category";

describe("Transaction Category", () => {
  test("renders category name in title case", () => {
    render(
      <TransactionCategory category="mocked category"></TransactionCategory>
    );

    expect(screen.getByText("Mocked category")).toBeInTheDocument();
  });
});
