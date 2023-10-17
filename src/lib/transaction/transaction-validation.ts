import moment from "moment";
import * as z from "zod";

import { throwError } from "@/lib/error-handling";
import { titleCase } from "@/lib/utils";
import { NextResponse } from "next/server";

import { TransactionClass } from "@/db/transaction";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";

import {
  ExpenseCategoriesList,
  IncomeCategoriesList,
} from "@/lib/transaction/transaction-categories";

const Errors = [
  [
    "Transaction type validation error",
    "Transaction type must be one of these values: " +
      Object.entries(TransactionTypesEnum)
        .map(([key, value]) => value)
        .join(", "),
  ],
  ["Transaction amount validation error", "Expense amount should be negative"],
  ["Transaction amount validation error", "Income amount should be positive"],
  ["Transaction date validation error", "Invalid date"],
  ["Transaction date validation error", "Date should not be later than now"],
  ["Transaction category validation error", "Invalid expense category"],
  ["Transaction category validation error", "Invalid income category"],
  ["Transaction amount validation error", "Amount must be in format (-)10.00"],
];

export function throwValidationError(index, ctx?, fieldName?) {
  if (!ctx) {
    return throwError(Errors[index] as [string, string]);
  } else {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: Errors[index][1],
      path: [fieldName],
    });
  }
}

export function validateTransaction(
  transaction: TransactionClass,
  ctx?
): NextResponse | void {
  if (!TransactionTypesEnum[titleCase(transaction.type)]) {
    return throwValidationError(0, ctx, "type");
  }

  if (
    !(
      +transaction.amount &&
      transaction.amount.trim() === transaction.amount &&
      !transaction.amount.includes("+") &&
      +transaction.amount === +Number(transaction.amount).toFixed(2)
    )
  ) {
    return throwValidationError(7, ctx, "amount");
  }

  if (
    transaction.type === TransactionTypesEnum.Expense &&
    +transaction.amount >= 0
  ) {
    return throwValidationError(1, ctx, "amount");
  }

  if (
    transaction.type === TransactionTypesEnum.Income &&
    +transaction.amount <= 0
  ) {
    return throwValidationError(2, ctx, "amount");
  }

  if (new Date(transaction.date).toString() === "Invalid Date") {
    return throwValidationError(3, ctx, "date");
  }

  if (+moment(transaction.date) > +moment()) {
    return throwValidationError(4, ctx, "date");
  }

  if (
    transaction.type === TransactionTypesEnum.Expense &&
    !ExpenseCategoriesList.includes(transaction.category)
  ) {
    return throwValidationError(5, ctx, "category");
  }

  if (
    transaction.type === TransactionTypesEnum.Income &&
    !IncomeCategoriesList.includes(transaction.category)
  ) {
    return throwValidationError(6, ctx, "category");
  }
}

export const validateTransactionForm = (transaction: TransactionClass, ctx) =>
  validateTransaction(transaction, ctx);
