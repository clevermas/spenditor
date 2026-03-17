import { getWeeksOfMonth, weeklyExpenses } from './weekly-expenses';
import { TransactionClass } from "@/db/transaction";
import moment, { Moment } from 'moment';
import { generateTransaction } from '@/test/mocks/account-api';

interface WeekData {
  weekStartDate: Moment | string;
  weekEndDate: Moment | string;
  isFullWeek: boolean;
}

const weeklyExpensesWrapper = 
  (transactions: TransactionClass[], startOfMonth: string) => 
    weeklyExpenses(transactions, startOfMonth)?.weeklyExpenses || [];

const generateWeeklyTransactions = (startOfMonth: string, weekIndex: number, expenses: number[], incomes: number[]) => {
  const mockTransactions: TransactionClass[] = [];

  const week: WeekData = getWeeksOfMonth(startOfMonth)[weekIndex];
  const startDate = week.weekStartDate.toDate();

  expenses.forEach(amount => {
    mockTransactions.push({
      ...generateTransaction(),
      amount,
      date: startDate,
    });
  });

  incomes.forEach(amount => {
    mockTransactions.push({
      ...generateTransaction(),
      type: 'income',
      amount,
      date: startDate,
    });
  });

  return mockTransactions;
};

const checkWeeks = (weeks: any[], expectedWeeks: WeekData[]) => {
  expect(weeks).toHaveLength(expectedWeeks.length);
  expect(weeks.map(
    ({weekStartDate, weekEndDate, isFullWeek}) => {
      return {
        weekStartDate: weekStartDate.clone().format("YYYY-MM-DD"),
        weekEndDate: weekEndDate.clone().format("YYYY-MM-DD"),
        isFullWeek,
      }
    })
  ).toEqual(expectedWeeks)
};

const checkWeeklyExpenses = (startOfMonth: string) => {
  const previousMonth = moment.utc(startOfMonth).subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const nextMonth = moment.utc(startOfMonth).add(1, 'month').startOf('month').format('YYYY-MM-DD');
  const weeksNum = getWeeksOfMonth(startOfMonth).length;
  const generateExpenses = (weeksInExpenses, num) => Array(weeksInExpenses)
    .fill(0)
    .map((_, i) => generateWeeklyTransactions(startOfMonth, i, Array(num).fill(10), []))
    .reduce((total, transactions) => [...total, ...transactions]);
  const generateIncomes = (weeksInIncomes, num) => Array(weeksInIncomes)
    .fill(0)
    .map((_, i) => generateWeeklyTransactions(startOfMonth, i, [], Array(num).fill(10)))
    .reduce((total, transactions) => [...total, ...transactions]);
  const mapExpenses = (result) => result.map(({expenses}) => expenses);
  const fillExpenses = (weeksWithExpenses, num) => [...Array(weeksWithExpenses).fill(num * 10), ...Array(weeksNum - weeksWithExpenses).fill(0)];


  test('should handle 0 transactions in month', () => {
    const transactions = [];
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    result.forEach(week => 
      expect(week.expenses).toBe(0)
    );
  });

  test('should handle 1-5 expenses on 1st week', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateWeeklyTransactions(startOfMonth, 0, Array(num).fill(10), []);
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(1, num));
  });

  test('should handle 1-5 expenses on 2 weeks skipping transactions from previous month', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = [
      ...generateWeeklyTransactions(previousMonth, 3, Array(num).fill(10), []),
      ...generateExpenses(2, num),
    ]
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(2, num));
  });

  test('should handle 1-5 expenses on 3 weeks', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateExpenses(3, num);
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(3, num));
  });

  test(`should handle 1-5 expenses on ${weeksNum} weeks skipping transactions from the next month`, () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = [
      ...generateExpenses(weeksNum, num),
      ...generateWeeklyTransactions(nextMonth, 2, Array(num).fill(10), [])
    ]
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(weeksNum, num));
  });

  test('should handle 0 expenses and 1-5 incomes on 1st week', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateWeeklyTransactions(startOfMonth, 0, [], Array(num).fill(10));
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(0, num));
  });

  test('should handle 0 expenses and 1-5 incomes on 2 weeks', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateIncomes(2, num);
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(0, num));
  });

  test('should handle 0 expenses and 1-5 incomes on 3 weeks', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateIncomes(3, num);
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(0, num));
  });

  test('should handle 0 expenses and 1-5 incomes on all weeks', () => {
    const num = Math.round(Math.random() * 4) + 1;
    const transactions = generateIncomes(weeksNum, num);
    const result = weeklyExpensesWrapper(transactions, startOfMonth);

    expect(mapExpenses(result)).toEqual(fillExpenses(0, num));
  });
} 

describe("getWeeksOfMonth", () => {
  describe('January 2025', () => {
    const startOfMonth = "2025-01-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for January 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-01-01', weekEndDate: '2025-01-04', isFullWeek: false },
        { weekStartDate: '2025-01-05', weekEndDate: '2025-01-11', isFullWeek: true },
        { weekStartDate: '2025-01-12', weekEndDate: '2025-01-18', isFullWeek: true },
        { weekStartDate: '2025-01-19', weekEndDate: '2025-01-25', isFullWeek: true },
        { weekStartDate: '2025-01-26', weekEndDate: '2025-01-31', isFullWeek: false },
      ]);
    });
  });

  describe('February 2025', () => {
    const startOfMonth = "2025-02-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for February 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-02-01', weekEndDate: '2025-02-01', isFullWeek: false },
        { weekStartDate: '2025-02-02', weekEndDate: '2025-02-08', isFullWeek: true },
        { weekStartDate: '2025-02-09', weekEndDate: '2025-02-15', isFullWeek: true },
        { weekStartDate: '2025-02-16', weekEndDate: '2025-02-22', isFullWeek: true },
        { weekStartDate: '2025-02-23', weekEndDate: '2025-02-28', isFullWeek: false },
      ]);
    });
  });

  describe('March 2025', () => {
    const startOfMonth = "2025-03-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for March 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-03-01', weekEndDate: '2025-03-01', isFullWeek: false },
        { weekStartDate: '2025-03-02', weekEndDate: '2025-03-08', isFullWeek: true },
        { weekStartDate: '2025-03-09', weekEndDate: '2025-03-15', isFullWeek: true },
        { weekStartDate: '2025-03-16', weekEndDate: '2025-03-22', isFullWeek: true },
        { weekStartDate: '2025-03-23', weekEndDate: '2025-03-29', isFullWeek: true },
        { weekStartDate: '2025-03-30', weekEndDate: '2025-03-31', isFullWeek: false },
      ]);
    });
  });

  describe('April 2025 (3 full weeks and 2 non-full week)', () => {
    const startOfMonth = "2025-04-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for April 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-04-01', weekEndDate: '2025-04-05', isFullWeek: false },
        { weekStartDate: '2025-04-06', weekEndDate: '2025-04-12', isFullWeek: true },
        { weekStartDate: '2025-04-13', weekEndDate: '2025-04-19', isFullWeek: true },
        { weekStartDate: '2025-04-20', weekEndDate: '2025-04-26', isFullWeek: true },
        { weekStartDate: '2025-04-27', weekEndDate: '2025-04-30', isFullWeek: false },
      ]);
    });

    checkWeeklyExpenses(startOfMonth);
  });

  describe('May 2025', () => {
    const startOfMonth = "2025-05-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for May 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-05-01', weekEndDate: '2025-05-03', isFullWeek: false },
        { weekStartDate: '2025-05-04', weekEndDate: '2025-05-10', isFullWeek: true },
        { weekStartDate: '2025-05-11', weekEndDate: '2025-05-17', isFullWeek: true },
        { weekStartDate: '2025-05-18', weekEndDate: '2025-05-24', isFullWeek: true },
        { weekStartDate: '2025-05-25', weekEndDate: '2025-05-31', isFullWeek: true },
      ]);
    });
  });

  describe('June 2025', () => {
    const startOfMonth = "2025-06-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for June 2025', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2025-06-01', weekEndDate: '2025-06-07', isFullWeek: true },
        { weekStartDate: '2025-06-08', weekEndDate: '2025-06-14', isFullWeek: true },
        { weekStartDate: '2025-06-15', weekEndDate: '2025-06-21', isFullWeek: true },
        { weekStartDate: '2025-06-22', weekEndDate: '2025-06-28', isFullWeek: true },
        { weekStartDate: '2025-06-29', weekEndDate: '2025-06-30', isFullWeek: false },
      ]);
    });
  });

  describe('February 2026 (4 full weeks and 0 non-full weeks)', () => {
    const startOfMonth = "2026-02-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for February 2026', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2026-02-01', weekEndDate: '2026-02-07', isFullWeek: true },
        { weekStartDate: '2026-02-08', weekEndDate: '2026-02-14', isFullWeek: true },
        { weekStartDate: '2026-02-15', weekEndDate: '2026-02-21', isFullWeek: true },
        { weekStartDate: '2026-02-22', weekEndDate: '2026-02-28', isFullWeek: true },
      ]);
    });

    checkWeeklyExpenses(startOfMonth);
  });

  describe('December 2024 (4 full weeks and 1 non-full week)', () => {
    const startOfMonth = "2024-12-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for December 2024', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2024-12-01', weekEndDate: '2024-12-07', isFullWeek: true },
        { weekStartDate: '2024-12-08', weekEndDate: '2024-12-14', isFullWeek: true },
        { weekStartDate: '2024-12-15', weekEndDate: '2024-12-21', isFullWeek: true },
        { weekStartDate: '2024-12-22', weekEndDate: '2024-12-28', isFullWeek: true },
        { weekStartDate: '2024-12-29', weekEndDate: '2024-12-31', isFullWeek: false },
      ]);
    });

    checkWeeklyExpenses(startOfMonth);
  });

  describe('April 2023 (4 full weeks and 2 non-full Weeks)', () => {
    const startOfMonth = "2023-04-01";
    const weeks = getWeeksOfMonth(startOfMonth);

    test('should have correct week data for April 2023', () => {
      checkWeeks(weeks, [
        { weekStartDate: '2023-04-01', weekEndDate: '2023-04-01', isFullWeek: false },
        { weekStartDate: '2023-04-02', weekEndDate: '2023-04-08', isFullWeek: true },
        { weekStartDate: '2023-04-09', weekEndDate: '2023-04-15', isFullWeek: true },
        { weekStartDate: '2023-04-16', weekEndDate: '2023-04-22', isFullWeek: true },
        { weekStartDate: '2023-04-23', weekEndDate: '2023-04-29', isFullWeek: true },
        { weekStartDate: '2023-04-30', weekEndDate: '2023-04-30', isFullWeek: false },
      ]);
    });

    checkWeeklyExpenses(startOfMonth);
  });

});