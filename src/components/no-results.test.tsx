import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { NoResults, noResultsText } from "./no-results";

describe("No Results", () => {
  test("renders correct text", () => {
    render(<NoResults />);

    expect(screen.getByText(noResultsText)).toBeInTheDocument();
  });
});
