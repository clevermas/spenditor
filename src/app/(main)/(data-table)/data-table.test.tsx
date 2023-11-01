import { TransactionClass } from "@/db/transaction";
import {
  generateTransaction,
  TransactionTypesEnum,
} from "@/lib/transaction/transaction";
import { ExpenseCategoriesList } from "@/lib/transaction/transaction-categories";
import { createList, titleCase } from "@/lib/utils";
import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import moment from "moment";
import { flattenTransactions } from "../page";
import { DataTable } from "./data-table";

describe("Home Data Table", () => {
  test("renders current day transactions group with Today title and corresponding expense", () => {
    const expenseCategory = ExpenseCategoriesList[2];

    const data = flattenTransactions([
      {
        date: moment().toISOString(),
        transactions: [
          {
            ...generateTransaction(),
            category: expenseCategory,
            tags: ["tag1", "tag2"],
            amount: "-66",
          },
        ],
      },
    ]);

    renderWithProviders(<DataTable data={data} />);

    const heading = screen.getByText("Today");
    const category = screen.getByText(titleCase(expenseCategory));
    const tags = [screen.getByText("TAG1"), screen.getByText("TAG2")];
    const price = screen.getByText("-$66.00");
    expect(heading).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(tags[0]).toBeInTheDocument();
    expect(tags[1]).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });

  test("renders previous day transactions group with Yesterday title and corresponding transactions", () => {
    const incomeCategory = ExpenseCategoriesList[2];
    const expenseCategory = ExpenseCategoriesList[1];
    const expensesNum = 5;

    const data = flattenTransactions([
      {
        date: moment().subtract(1, "days").toISOString(),
        transactions: [
          {
            ...generateTransaction(),
            type: TransactionTypesEnum.Income,
            category: incomeCategory,
            amount: "34.35",
          },
          ...createList<TransactionClass>(expensesNum, () => ({
            ...generateTransaction(),
            category: expenseCategory,
            amount: "-2",
          })),
        ],
      },
    ]);

    renderWithProviders(<DataTable data={data} />);

    const heading = screen.getByText("Yesterday");
    const category = screen.getByText(titleCase(incomeCategory));
    const price = screen.getByText("$34.35");
    const expenses = screen.queryAllByText("-$2.00");
    expect(heading).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(expenses).toHaveLength(expensesNum);
  });

  test("renders date in correct format", () => {
    const expenseCategory = ExpenseCategoriesList[2];

    const data = flattenTransactions([
      {
        date: moment("2001 09 11", "YYYY MM D").toISOString(),
        transactions: [
          {
            ...generateTransaction(),
            category: expenseCategory,
            amount: "-66",
          },
        ],
      },
    ]);

    renderWithProviders(<DataTable data={data} />);

    const heading = screen.getByText("Tue, 11 Sep");
    expect(heading).toBeInTheDocument();
  });
});
