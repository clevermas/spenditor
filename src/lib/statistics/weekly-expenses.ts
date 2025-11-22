import moment, { Moment } from "moment";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";

interface WeekData {
  weekStartDate: Moment;
  weekEndDate: Moment;
  isFullWeek: boolean;
}

export function getWeeksOfMonth(startOfMonth: Moment | string): WeekData[] {
  startOfMonth = moment.utc(startOfMonth);

  let start = startOfMonth.clone().startOf('month');
  const end = startOfMonth.clone().endOf('month');
  const weeks: WeekData[] = [];

  while (start.isSameOrBefore(end)) {
    let weekStartDate = start.clone().startOf('week');
    let weekEndDate = start.clone().endOf('week');

    const isFullWeek = weekStartDate.isSame(startOfMonth, 'month') && 
                       weekEndDate.isSame(end, 'month');

    if (weekStartDate.isBefore(startOfMonth)) {
        weekStartDate = startOfMonth.clone();
        weekEndDate = weekStartDate.clone().endOf('week');
    }

    if (weekEndDate.isAfter(end)) {
        weekEndDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
        weekEndDate = end.clone();
    }

    weeks.push({
        weekStartDate,
        weekEndDate,
        isFullWeek
    });

    if (isFullWeek) {
      start.add(1, 'week');
    }
    else {
      start = weekEndDate.clone().add(1, 'day').startOf('day');
    }
  }

  return weeks;
}

export function weeklyExpenses(data: any[], startOfMonth: Moment | string) {
  startOfMonth = moment.utc(startOfMonth);

  const endOfMonth = moment(startOfMonth).endOf('month');
  const expensesData = data.filter((t) =>
    t.date >= startOfMonth.toDate() && 
    t.date <= endOfMonth.toDate() && 
    t.type === TransactionTypesEnum.Expense
  );

  return { 
    weeklyExpenses: getWeeksOfMonth(startOfMonth).map(
      ({weekStartDate, weekEndDate, isFullWeek}) => {
        return {
          weekStartDate: weekStartDate.format("YYYY-MM-DD"),
          weekEndDate: weekEndDate.format("YYYY-MM-DD"),
          isFullWeek,
          expenses: expensesData.reduce((value, transaction) => {
            const date = moment(transaction.date);
            const onThisWeek =
              date.isSameOrAfter(weekStartDate) &&
              date.isSameOrBefore(weekEndDate);
            return value + (onThisWeek ? Math.abs(transaction.amount) : 0);
          }, 0),
        };
    })
  };
}