import moment from "moment";
import { NextResponse } from "next/server";

import { Transaction, TransactionClass } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { validateTransaction } from "@/lib/transaction/transaction-validation";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  let transaction = (await req.json()) as TransactionClass;

  const account = await currentAccount();

  if (account instanceof NextResponse) {
    return account;
  }

  const transactionId = params.id;

  transaction = { ...transaction, date: moment(transaction?.date) };

  const validation = validateTransaction(transaction);

  if (validation instanceof NextResponse) {
    return validation;
  }

  return await handleMongoDbQuery(
    async () =>
      await Transaction.findByIdAndUpdate(transactionId, transaction, {
        new: true,
      })
        .lean()
        .exec()
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const account = await currentAccount();

  if (account instanceof NextResponse) {
    return account;
  }

  const transactionId = params.id;

  return await handleMongoDbQuery(
    async () => await Transaction.findByIdAndDelete(transactionId).exec(),
    {
      successMap: () => ({ success: true }),
    }
  );
}
