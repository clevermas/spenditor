import { TransactionClass } from "@/db/transaction";
import {
  flattenTransactions,
  TransactionTypesEnum,
} from "@/lib/transaction/transaction";
import { ExpenseCategoriesList } from "@/lib/transaction/transaction-categories";
import { createList, titleCase } from "@/lib/utils";
import { generateTransaction } from "@/test/mocks/account-api";
import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import moment from "moment";
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

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText(titleCase(expenseCategory))).toBeInTheDocument();
    expect(screen.getByText("TAG1")).toBeInTheDocument();
    expect(screen.getByText("TAG2")).toBeInTheDocument();
    expect(screen.getByText("-$66.00")).toBeInTheDocument();
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

    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText(titleCase(incomeCategory))).toBeInTheDocument();
    expect(screen.getByText("$34.35")).toBeInTheDocument();
    expect(screen.queryAllByText("-$2.00")).toHaveLength(expensesNum);
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

    expect(screen.getByText("Tue, 11 Sep")).toBeInTheDocument();
  });
});
