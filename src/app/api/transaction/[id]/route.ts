import moment from "moment";
import { NextResponse } from "next/server";

import { Account, AccountClass } from "@/db/account";
import { Transaction, TransactionClass } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { validateTransaction } from "@/lib/transaction/transaction-validation";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  let transaction = (await req.json()) as TransactionClass;

  const account = (await currentAccount()) as AccountClass;
  if (account instanceof NextResponse) {
    return account;
  }

  const transactionId = params.id;

  transaction = { ...transaction, date: moment(transaction?.date).toDate() };

  const validation = validateTransaction(transaction);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const oldTransaction = await handleMongoDbQuery(
    async () =>
      await Transaction.findByIdAndUpdate(transactionId, transaction)
        .lean()
        .exec(),
    {
      withoutResponse: true,
    }
  );
  if (oldTransaction instanceof NextResponse) {
    return oldTransaction;
  }

  const newBalance = +Number(
    +account?.balance - +oldTransaction?.amount + +transaction?.amount
  ).toFixed(2);

  return await handleMongoDbQuery(
    async () =>
      await Account.findByIdAndUpdate(account?.id, {
        balance: newBalance,
      }).exec(),
    {
      successMap: () => transaction,
      successStatus: 201,
    }
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const account = (await currentAccount()) as AccountClass;
  if (account instanceof NextResponse) {
    return account;
  }

  const transactionId = params.id;

  const transaction = await handleMongoDbQuery(
    async () =>
      await Transaction.findByIdAndDelete(transactionId).lean().exec(),
    {
      withoutResponse: true,
    }
  );
  if (transaction instanceof NextResponse) {
    return transaction;
  }

  const newBalance = +Number(+account?.balance - +transaction?.amount).toFixed(
    2
  );

  return await handleMongoDbQuery(
    async () =>
      await Account.findByIdAndUpdate(account?.id, {
        balance: newBalance,
      }).exec(),
    {
      successMap: () => ({ success: true }),
    }
  );
}
