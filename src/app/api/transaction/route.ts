import * as moment from "moment";

import { DailyTransactionsList, Transaction } from "@/api/common";
import { data } from "@/app/api/transactions/";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let transaction = await req.json();
  transaction = { id: randomUUID(), ...transaction };

  let groupFound;

  data.data.forEach((group) => {
    const format = (date) => moment(date).format("M D YYYY");
    if (format(group.date) === format(transaction.date)) {
      groupFound = true;
      group.transactions = [transaction, ...group.transactions];
    }
  });

  if (!groupFound) {
    data.data = [createNewDailyTransactionsGroup(transaction), ...data.data];
  }

  return NextResponse.json(transaction, { status: 201 });
}

export function createNewDailyTransactionsGroup(
  transaction: Transaction
): DailyTransactionsList {
  const date = moment(transaction.date).startOf("day").toISOString();

  return {
    date,
    transactions: [transaction],
  };
}
