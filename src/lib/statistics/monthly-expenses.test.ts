import { monthlyExpenses } from './monthly-expenses';
import { TransactionClass } from '../transaction/transaction';
import moment from 'moment';
import { generateTransaction } from '@/test/mocks/account-api';

describe("monthlyExpenses", () => {
  const startOfMonth = moment.utc("2025-11-01");
  const previousMonth = startOfMonth.clone().subtract(1, "month").startOf("month");
  const nextMonth = startOfMonth.clone().add(1, "month").startOf("month");

  test("should correctly map statistics data for a given month", () => {
    const mockTransactions = [
       {
        ...generateTransaction(),
        amount: -300,
        date: previousMonth.toDate(),
      },
      {
        ...generateTransaction(),
        amount: -100,
        category: "food",
        date: startOfMonth.clone().add(1, "days").toDate(),
      },
      {
        ...generateTransaction(),
        amount: -50,
        category: "transport",
        date: startOfMonth.clone().add(8, "days").toDate(),
      },
      {
        ...generateTransaction(),
        amount: -200,
        category: "food",
        date: startOfMonth.clone().add(15, "days").toDate(),
      },
      {
       ...generateTransaction(),
        amount: 300,
        category: "salary",
        date: startOfMonth.clone().add(20, "days").toDate(),
        type: "Income",
      },
      {
        ...generateTransaction(),
        amount: -200,
        category: "expense",
        date: nextMonth.toDate(),
      },
    ];

    const result = monthlyExpenses(mockTransactions, startOfMonth);

    expect(result.monthlyExpenses.categories).toHaveLength(2);
    expect(result.monthlyExpenses.categories).toEqual(
      expect.arrayContaining([
        { name: "food", value: 300 },
        { name: "transport", value: 50 },
      ])
    );
    expect(result.monthlyExpenses.total).toBe(350);
  });

  test("should handle no transactions", () => {
    const mockTransactions: any[] = [];
    const result = monthlyExpenses(mockTransactions, startOfMonth);

    expect(result.monthlyExpenses.categories).toHaveLength(0);
    expect(result.monthlyExpenses.total).toBe(0);
  });

  test("should group expense categories correctly when more than 5", () => {
      const mockTransactions = [
      {
        ...generateTransaction(),
        amount: -100,
        category: "expense",
        date: startOfMonth.clone().add(1, "days").toDate(),
      },
      {
        ...generateTransaction(),
        amount: -50,
        category: "entertainment",
        date: startOfMonth.clone().add(8, "days").toDate(),
      },
      {
        ...generateTransaction(),
        amount: -200,
        category: "shopping",
        date: startOfMonth.clone().add(10, "days").toDate(),
      },
      {
       ...generateTransaction(),
        amount: -300,
        category: "health",
        date: startOfMonth.clone().add(12, "days").toDate(),
      },
      {
       ...generateTransaction(),
        amount: -150,
        category: "education",
        date: startOfMonth.clone().add(18, "days").toDate(),
      },
      {
       ...generateTransaction(),
        amount: -123,
        category: "transport",
        date: startOfMonth.clone().add(22, "days").toDate(),
      },
      {
       ...generateTransaction(),
        amount: -100,
        category: "food and supermarkets",
        date: startOfMonth.clone().add(28, "days").toDate(),
      },
    ];

    const result = monthlyExpenses(mockTransactions, startOfMonth);

    expect(result.monthlyExpenses.categories).toEqual([
      { name: 'health', value: 300 },
      { name: 'shopping', value: 200 },
      { name: 'education', value: 150 },
      { name: 'transport', value: 123 },
      { name: "other", value: 250 }
    ]);
  });
});