import { noResultsText } from "@/components/no-results";
import { generateFourChartDataItems } from "@/test/mocks/account-api";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WeeklyExpensesChart from "./weekly-expenses-chart";

describe("Weekly Expenses Chart", () => {
  const data = generateFourChartDataItems();

  test("renders skeleton while fetching", () => {
    render(<WeeklyExpensesChart data={[]} currency="USD" loading={true} />);

    expect(
      screen.getByTestId("weekly-expenses-chart-skeleton")
    ).toBeInTheDocument();
  });

  test("renders correct categories with amounts", () => {
    render(<WeeklyExpensesChart data={data} currency="USD" />);

    expect(screen.getByText("mocked")).toBeInTheDocument();
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("mocked 2")).toBeInTheDocument();
    expect(screen.getByText("$2.00")).toBeInTheDocument();
    expect(screen.getByText("mocked 3")).toBeInTheDocument();
    expect(screen.getByText("$3.00")).toBeInTheDocument();
    expect(screen.getByText("mocked 4")).toBeInTheDocument();
    expect(screen.getByText("$4.00")).toBeInTheDocument();
  });

  test("renders no results after null data fetched", () => {
    render(<WeeklyExpensesChart data={[]} currency="USD" />);

    expect(screen.getByText(noResultsText)).toBeInTheDocument();
  });
});
