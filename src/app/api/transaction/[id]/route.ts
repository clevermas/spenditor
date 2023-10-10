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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  data.data = data.data.filter((group, groupIndex) => {
    data.data[groupIndex].transactions = data.data[
      groupIndex
    ].transactions.filter((t) => t.id !== params.id);
    return data.data[groupIndex].transactions.length;
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
