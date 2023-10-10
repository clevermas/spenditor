import { data } from "@/app/api/transactions/";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const transaction = await req.json();

  data.data.forEach((group, groupIndex) => {
    const index = group.transactions.findIndex(
      (transaction) => transaction.id === params.id
    );
    if (index !== -1) {
      data.data[groupIndex].transactions[index] = { ...transaction };
    }
  });

  return NextResponse.json(transaction, { status: 200 });
}
