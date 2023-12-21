import { noResultsText } from "@/components/no-results";
import { generateFourChartDataItems } from "@/test/mocks/account-api";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ExpensesPieChart from "./expenses-pie-chart";

describe("Expenses Pie Chart", () => {
  const data = generateFourChartDataItems();

  test("renders skeleton while fetching", () => {
    render(<ExpensesPieChart data={[]} currency="USD" loading={true} />);

    expect(
      screen.getByTestId("expenses-pie-chart-skeleton")
    ).toBeInTheDocument();
  });

  test("renders correct categories with amounts", () => {
    render(<ExpensesPieChart data={data} currency="USD" />);

    expect(screen.getByText("Mocked")).toBeInTheDocument();
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("Mocked 2")).toBeInTheDocument();
    expect(screen.getByText("$2.00")).toBeInTheDocument();
    expect(screen.getByText("Mocked 3")).toBeInTheDocument();
    expect(screen.getByText("$3.00")).toBeInTheDocument();
    expect(screen.getByText("Mocked 4")).toBeInTheDocument();
    expect(screen.getByText("$4.00")).toBeInTheDocument();
  });

  test("renders no results after null data fetched", () => {
    render(<ExpensesPieChart data={[]} currency="USD" />);

    expect(screen.getByText(noResultsText)).toBeInTheDocument();
  });
});
